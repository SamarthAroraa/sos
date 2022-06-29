import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {

  const type = 1;
  return (
    <View style={styles.container}>
      <View style={[styles.sirenContainer, {backgroundColor:type === 1 ? 'blue' : 'red',}]}>
        <Text style={{fontSize: 20, color:''}}>
          Siren
        </Text>
        <Text>
          108dB
        </Text>
      </View>

      <TouchableOpacity style={{height: 200, width: 200, borderRadius: 100, backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 100,
    }}>
        <Text style={{fontSize: 40, color:'white', fontWeight:'bold'}}>
          SOS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        console.log("Add modal Here")
      }} style={{ width: '90%',
    margin:'auto',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 20,
    backgroundColor:'white',
    marginTop: 200,
    paddingHorizontal: 40}}>
        <Text style={{fontSize: 20, color:'blue'}}>
          Add Contact
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
  sirenContainer:{
    width: '90%',
    margin:'auto',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
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
