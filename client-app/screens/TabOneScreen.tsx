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


  const startRecording = () => {
    RNSoundLevel.start()

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
  useEffect(() => {

    AudioRecord.init(options);
    if (sendRequests) {
    startRecording();
    setInterval(async () => { await sampleAudio() }, 5000)

    RNSoundLevel.onNewFrame = (data: any) => {
      // see "Returned data" section below
      setDecibel(data.value + 160)
      // console.log('Sound level info', data)
    }
    }

  }, [])


  useEffect(() => {
    if (emergency) {
      if (sendRequests) {
      sendNotifications()
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
    RNSoundLevel.stop()
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
        <Text style={{ fontSize: 20, color: 'white' }}>{sendRequests ? classification : "Auto classification Disabled for 5 hours"}</Text>
        <Text>
          {sendRequests ? decibel : "However, you can still trigger manual SOS"}
        </Text>
      </View>

      <TouchableOpacity style={{
        height: 200, width: 200, borderRadius: 100, backgroundColor: emergency === false ? 'red' : 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}
        onPress={toggleEmergency}
      >
        <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold', textAlign: 'center', }}>
          {sendRequests ?
            (emergency === false ? "HELP ME!" : "I'M SAFE NOW") :
            "HELP ME!"}
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
