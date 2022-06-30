import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { AsyncStorage } from 'react-native';


const AddContact = () => {
    const [value, setValue] = useState(0);
    const [contactName, setContactName] = useState("");
    const [slackId, setSlackId] = useState("");

    const handleContactChange = (newText: any) => {
        setContactName(newText)
    }
    const handleSlackChange = (newText: any) => {
        setSlackId(newText)
    }
    const handleSaveContact = async () => {
        // props.toggleModal()
        console.log("*************")
        console.log(contactName, slackId)
        console.log("*************")
        await AsyncStorage.setItem(
            'emergency_contact_name',
            contactName
        );
        await AsyncStorage.setItem(
            'emergency_contact_slack',
            slackId
        );
        // window.localStorage.setItem("",);
        // window.localStorage.setItem("emergency_contact_slack", slackId);

    }


    return (
        // <View style={styles.container}>
        <View >
            <Text style={{ fontSize: 30, color: 'white', alignItems: 'center', marginBottom: 20 }}> Add Emergency Contact </Text>
            <View style={{ backgroundColor: '#ffcdb2', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: 'white', }}> Enter Contact Name </Text>
                <TextInput value={contactName} onChangeText={handleContactChange} style={{ fontSize: 15, color: 'black', backgroundColor: '#C0C0C0' }} placeholder="Enter Contact Name" />
                <Text style={{ fontSize: 20, color: 'white', }}> Enter Slack Id</Text>
                <TextInput value={slackId} onChangeText={handleSlackChange} style={{ fontSize: 15, color: 'black', backgroundColor: '#C0C0C0' }} placeholder="Enter Slack Id" />
                <TouchableOpacity
                    onPress={handleSaveContact}
                >
                    <Button
                        color="#6d6875"
                        onPress={handleSaveContact}
                        title="" />
                </TouchableOpacity>

            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#E6E6FA',
        alignItems: 'center',
        justifyContent: 'center',
        // color: "white",
    },
});

export default AddContact;