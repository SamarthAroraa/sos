// @ts-nocheck
import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Button } from 'react-native';
// @ts-ignore
import RNSoundLevel from 'react-native-sound-level'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AudioRecord from 'react-native-audio-record';
import { Dirs, FileSystem } from 'react-native-file-access';
import axios from 'axios'
import sendNotifications from '../utils/SendNotification'
// import ModalScreen from './ModalScreen';
import AddContact from '../components/AddContact';
// import {Button, View, StyleSheet} from 'react-native';
import { AsyncStorage } from 'react-native';


import Modal from 'react-native-modal';
import ModalScreen from './ModalScreen';
import GetLocation from 'react-native-get-location'





export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const options = {
    sampleRate: 16000,  // default 44100
    channels: 1,        // 1 or 2, default 1
    bitsPerSample: 16,  // 8 or 16, default 16
    audioSource: 6,     // android only (see below)
    wavFile: 'test.wav' // default 'audio.wav'
  };
  const [classification, setClassification] = useState("Unclassified")
  const [emergency, setEmergency] = useState(false)
  const [decibel, setDecibel] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };



  const getContactName = async () => {
    let name = await AsyncStorage.getItem('emergency_contact_name');
    console.log(name)
    return name;
  }

  const getContactSlackId = async () => {
    let id = await AsyncStorage.getItem('emergency_contact_slack');
    console.log(id)
    return id;
  }

  const startRecording = () => {
    RNSoundLevel.start()

    AudioRecord.start();
    console.log('start')
    AudioRecord.on('data', data => {
      // console.log(data);
    });
  }

  const sampleAudio = async () => {
    await stopRecording();
    startRecording();
  }

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(location => {
      console.log(location);
    }).catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
  }

  useEffect(() => {

    AudioRecord.init(options);
    startRecording();
    setInterval(async () => { await sampleAudio() }, 5000)
    RNSoundLevel.onNewFrame = (data: any) => {
      // see "Returned data" section below
      setDecibel(data.value + 160)
      // console.log('Sound level info', data)
      setDecibel(data.value + 160)
      // console.log('Sound level info', data)
    }

    getLocation()

  }, [])

  const SendSOSLocation = () => {
    console.log('sos sending')
    let req_data = JSON.stringify({
      "slackId": getContactSlackId,
      "Name": getContactName
    });
    let config = {
      method: 'post',
      url: 'https://safeoversorry.pagekite.me/slackLocation',
      // url: 'https://127.0.0.1:5000/serveModel',

      headers: {
        'Content-Type': 'application/json'
      },
      data: req_data
    };
    axios(config)
      .then(function (response) {
        // setClassification(JSON.stringify(response.data['prediction']));
        // setEmergency(response.data['EMERGENCY']);
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);


      });
  }
  useEffect(() => {
    if (emergency) {
      sendNotifications()
      SendSOSLocation()
    }
  }, [emergency])


  // useEffect(() => {

  //   stopRecording();

  // }, [classification])

  const stopRecording = async () => {

    let audioFile = await AudioRecord.stop();
    RNSoundLevel.stop()
    // console.log("audioFIle", audioFile)
    const recording = await FileSystem.readFile(audioFile, 'base64');
    console.log('stopping')

    let req_data = JSON.stringify({
      "wav_blob": recording
    });
    let config = {
      method: 'post',
      url: 'https://safeoversorry.pagekite.me/serveModel',
      // url: 'https://127.0.0.1:5000/serveModel',

      headers: {
        'Content-Type': 'application/json'
      },
      data: req_data
    };
    axios(config)
      .then(function (response) {
        setClassification(JSON.stringify(response.data['prediction']));
        setEmergency(response.data['EMERGENCY']);

        // console.log(JSON.stringify(response.data))

      })
      .catch(function (error) {
        console.log(error);


      });

  }

  const type = 1;
  return (
    <View style={styles.container}>
      <View style={[styles.sirenContainer, { backgroundColor: emergency === false ? 'blue' : 'red', }]}>
        <Text style={{ fontSize: 20, color: 'white' }}>{classification}</Text>
        <Text>
          {decibel}
        </Text>
      </View>

      <TouchableOpacity style={{
        height: 200, width: 200, borderRadius: 100, backgroundColor: emergency === false ? '#ffb4a2' : '#6d6875',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}>
        <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold', textAlign: 'center', }}>
          {emergency === false ? "HELP ME!" : "I'M SAFE NOW"}
        </Text>
      </TouchableOpacity>


      {/* <TouchableOpacity onPress={() => {
        console.log("Add modal Here")
      }} style={{
        width: '90%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',
        marginTop: 200,
        paddingHorizontal: 40
      }}>
        <Text style={{ fontSize: 20, color: 'blue' }}>
          Add Emergency Contact
        </Text>
      </TouchableOpacity> */}
      <View style={styles.container}>
        <Button title="Add Emergency Contact" onPress={toggleModal} />
        <Modal
          isVisible={isModalVisible}>
          <View>
            <AddContact />
            <View>
              <Button title="Hide modal" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#e5989b'
  },
  sirenContainer: {
    width: '90%',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
