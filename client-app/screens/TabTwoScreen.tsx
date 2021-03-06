import { StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, Text, View } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';

import { AsyncStorage } from 'react-native';
import { useEffect, useState } from 'react';

// import { useEffect, useState } from 'react';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// // @ts-ignore
// import RNSoundLevel from 'react-native-sound-level'
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';
// import { RootTabScreenProps } from '../types';
// import AudioRecord from 'react-native-audio-record';
// import { Dirs, FileSystem } from 'react-native-file-access';
// import axios from 'axios'




export default function TabTwoScreen() {

  const [name, setName] = useState<string | null>("")
  const [id,setId]  = useState<string | null>("")
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
  

  const getContactName = async () => {
    let name = await AsyncStorage.getItem('emergency_contact_name');
    setName(name);
    console.log(name)
    return name;
  }
  
  const getContactSlackId = async () => {
    let id = await AsyncStorage.getItem('emergency_contact_slack');
    setId(id)
    console.log(id)
    return id;
  }

  useEffect(()=>{
     getContactName()
    getContactSlackId();
   
  },[])
  
  const type = 1;
  return (
    <View style={styles.container}>
    <View>
     <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold'}}><Text >EMERGENCY CONTACT NAME :</Text><Text style={{color:"green"}}>{name}</Text></Text>
     <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold'}}><Text>EMERGENCY CONTACT SLACK ID :</Text><Text style={{color:"green"}}>{id}</Text></Text>
     </View>
    </View>
  );
}



// import { useEffect, useState } from 'react';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// // @ts-ignore
// import RNSoundLevel from 'react-native-sound-level'
// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';
// import { RootTabScreenProps } from '../types';
// import AudioRecord from 'react-native-audio-record';
// import { Dirs, FileSystem } from 'react-native-file-access';
// import axios from 'axios'

// export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
//   const options = {
//     sampleRate: 16000,  // default 44100
//     channels: 1,        // 1 or 2, default 1
//     bitsPerSample: 16,  // 8 or 16, default 16
//     audioSource: 6,     // android only (see below)
//     wavFile: 'test.wav' // default 'audio.wav'
//   };
//   const [classification, setClassification] = useState("Unclassified")

//   const startRecording = () => {
    
//       AudioRecord.start();
//       console.log('start')
      

    
//     AudioRecord.on('data', data => {
//       //send data to backend every  seconds
//     });

    

//   }

// const sampleAudio = async () => {
//   await stopRecording();
//   startRecording();
// }
//   useEffect(() => {

//     AudioRecord.init(options);
//     startRecording();
//     setInterval(async ()=>{await sampleAudio()},5000)
    


//   },[])



 
//   // useEffect(() => {
    
//   //   stopRecording();

//   // }, [classification])

//   const stopRecording = async () => {
      
    

//     let audioFile = await AudioRecord.stop();
//     console.log("audioFIle",audioFile)
//     const recording = await FileSystem.readFile(audioFile, 'base64');
//     console.log('stopping')

//     let req_data = JSON.stringify({
//       "wav_blob": recording
//     });
//     let config = {
//       method: 'post',
//       url: 'https://safeoversorry.pagekite.me/serveModel',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: req_data
//     };
//     axios(config)
//       .then(function (response) {
//         setClassification(JSON.stringify(response.data));
//         console.log(JSON.stringify(response.data))

//       })
//       .catch(function (error) {
//         console.log(error);


//       });

//   } 

  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{classification}</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="/screens/TabOneScreen.tsx" />
//       <TouchableOpacity onPress={() => {
//         startRecording()
//       }}>
//         <Text>Start Recording</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => {
//         stopRecording()
//       }}>
//         <Text>Stop Recording</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

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
