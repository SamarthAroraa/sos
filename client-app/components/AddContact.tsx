import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';

const AddContact = () => {
    const [value, setValue] = useState(0);
    return (
        <View>
            <Text> Add Emergency Contact </Text>
            <View>
                <TextInput placeholder="Enter Contact Name" />
                <TextInput
                    secureTextEntry={true}
                    placeholder="Enter Password"
                />
            </View>
        </View>
    )
}