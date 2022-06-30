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


// import Modal from 'react-native-modal';
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
  const [sendRequests, setSendRequests] = useState(true)

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
    // RNSoundLevel.start()

    AudioRecord.start();
    // console.log('start')
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
      if (sendRequests) {
        sendNotifications()
        // SendSOSLocation()
      }
    }
  }, [emergency])

  const toggleEmergency = () => {
    //this means pressed I'm safe manually
    // so disable auto classification 
    if (sendRequests == true) {
      if (emergency) {
        setEmergency(false);

        setSendRequests(false)
        console.log('setting false')
        setTimeout(() => {
          setSendRequests(true)
          console.log('setting back true')
        }, 1000 * 60 * 1)
      } else {
        setEmergency(true)
      }
    } else {
      setSendRequests(true);
      setEmergency(true);
    }

  }



  // useEffect(() => {

  //   stopRecording();

  // }, [classification])

  const stopRecording = async () => {

    let audioFile = await AudioRecord.stop();
    // RNSoundLevel.stop()
    // console.log("audioFIle", audioFile)
    const recording = await FileSystem.readFile(audioFile, 'base64');
    // console.log('stopping')

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
      <View style={[styles.sirenContainer, { backgroundColor: emergency === false ? '#d8e2dc' : '#6d6875', }]}>
        <Text style={{ fontSize: 20, color: emergency === false ? '#6d6875' : 'white', textAlign: 'center' }}>{sendRequests ? classification : "Auto classification disabled for 30 minutes"}</Text>
      </View>

      <TouchableOpacity style={{
        height: 250, width: 250, borderRadius: 150, backgroundColor: emergency === false ? '#ffb4a2' : '#6d6875',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        borderColor: 'white',
        borderWidth: 2,
        padding: 40,
        marginBottom: 80
      }}
        onPress={toggleEmergency}
      >
        <Text style={{ fontSize: 35, color: 'white', fontWeight: 'bold', textAlign: 'center', }}>
          {sendRequests ?
            (emergency === false ? "Help Me!" : "I'm Safe Now.") :
            "HELP ME!"}
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
      <View style={[styles.container]}>
        <Button color="#6d6875" style={{ padding: 20 }} title="Add Emergency Contact" onPress={toggleModal}>

        </Button>
        <Modal
          isVisible={isModalVisible} >
          <View>
            <AddContact />
            <View style={{ marginTop: 20 }}>
              <Button color="#6d6875" title="Hide modal" onPress={toggleModal} />
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
    paddingHorizontal: 40,
    height: 120,
    borderRadius: 20,
    marginTop: 20
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
