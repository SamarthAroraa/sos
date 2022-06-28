import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
// @ts-ignore
import RNSoundLevel from 'react-native-sound-level'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AudioRecord from 'react-native-audio-record';
import { Dirs, FileSystem } from 'react-native-file-access';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const options = {
    sampleRate: 16000,  // default 44100
    channels: 1,        // 1 or 2, default 1
    bitsPerSample: 16,  // 8 or 16, default 16
    audioSource: 6,     // android only (see below)
    wavFile: 'test.wav' // default 'audio.wav'
  };
 
 
  useEffect(() => {
    // RNSoundLevel.start()
    // RNSoundLevel.onNewFrame = (data:any) => {
    // // see "Returned data" section below
    // console.log('Sound level info', data)
  // }
  AudioRecord.init(options);
  AudioRecord.start();
  AudioRecord.on('data', data => {
   console.log('data', data)
  });
  },[])
  let audioFile
  const stopRecording = async () => {
    audioFile = await AudioRecord.stop();
    console.log("audioFIle",audioFile)
    const text = await FileSystem.readFile(Dirs.CacheDir + '');
    console.log(text)
  } 
  
 
 
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <TouchableOpacity onPress={() => {
        stopRecording()
      }}>
        <Text>Stop Recording</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
