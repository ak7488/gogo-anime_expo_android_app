import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

const TouchableComponent = (props) => {
    let Touchable = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        Touchable = TouchableNativeFeedback
    }

    return (
        <Touchable activeOpacity={0.5} {...props} />
    )

}

export default TouchableComponent;