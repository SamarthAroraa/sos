import * as React from 'react';
import * as Linking from "expo-linking"
import * as SMS from 'expo-sms';

async function InitiateEmergencyCall(phone_number: any) {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
            [phone_number],
            'My sample HelloWorld message',
        )
        console.log(result)
    } else {
        //error message here
        console.log("not available")
    }
    Linking.openURL(`tel://+91 ${phone_number}`)

}

export default InitiateEmergencyCall;