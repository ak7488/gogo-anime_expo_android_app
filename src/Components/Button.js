import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TouchableComponent from "./TouchableComponent";
import { useSelector } from 'react-redux';

const Button = (props) => {
    const { colorOne, colorTwo } = useSelector(state => state)
    const {
        text = "",
        style = {},
        onPress = () => { },
        width = 150,
        radus = 5,
        color = colorTwo,
        bgColor = colorOne,
    } = props;
    const styles = StyleSheet.create({
        button: {
            padding: 10,
            backgroundColor: bgColor,
            borderRadius: radus,
            width: width,
            justifyContent: "center",
            alignItems: "center",
            ...style,
        },
        text: {
            color: color,
        },
        outer: {
            borderRadius: radus,
            overflow: "hidden",
        },
    });

    return (
        <View style={styles.outer}>
            <TouchableComponent onPress={onPress}>
                <View style={styles.button}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </TouchableComponent>
        </View>
    );
};

export default Button;
