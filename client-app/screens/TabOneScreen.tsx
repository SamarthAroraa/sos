import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
// @ts-ignore
import RNSoundLevel from 'react-native-sound-level'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AudioRecord from 'react-native-audio-record';
import { Dirs, FileSystem } from 'react-native-file-access';
import axios from 'axios'
import sendNotifications from '../utils/SendNotification'
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
    }) .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
  }

  useEffect(() => {

    AudioRecord.init(options);
    startRecording();
    setInterval(async () => { await sampleAudio() }, 5000)
    RNSoundLevel.onNewFrame = (data:any) => {
      // see "Returned data" section below
      setDecibel(data.value +160)
      // console.log('Sound level info', data)
    }

    getLocation()

  }, [])


  useEffect(() => {
    if (emergency) {
      sendNotifications()
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


  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>{classification}</Text>
  //     <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
  //     <EditScreenInfo path="/screens/TabOneScreen.tsx" />
  //     {/* <TouchableOpacity onPress={() => {
  //       startRecording()
  //     }}>
  //       <Text>Start Recording</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity onPress={() => {
  //       stopRecording()
  //     }}>
  //       <Text>Stop Recording</Text>
  //     </TouchableOpacity> */}
  //   </View>
  // );
  const type = 1;
  return (
    <View style={styles.container}>
      <View style={[styles.sirenContainer, { backgroundColor: emergency === false ? 'blue' : 'red', }]}>
        <Text style={{ fontSize: 20, color: '' }}>{classification}</Text>
        <Text>
          {decibel}
        </Text>
        {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
        {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      </View>

      <TouchableOpacity style={{
        height: 200, width: 200, borderRadius: 100, backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}>
        <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
          SOS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
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
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
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
