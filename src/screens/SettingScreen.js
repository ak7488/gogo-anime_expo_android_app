import React, { useState } from "react";
import { Text, View, Modal, Dimensions, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../store/action";
import { ColorPicker, toHsv } from "react-native-color-picker";
import TouchableComponent from "../Components/TouchableComponent";
import Button from '../Components/Button'
import { ScrollView } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';

const BlockColor = ({ color, text, name }) => {
    const dispatch = useDispatch();
    const { colorOne, colorTwo, colorThree, colorFour } = useSelector((state) => state);

    const [colorPickerShow, setColorPickerShow] = useState(false);
    const [colorSelected, setColorSelected] = useState(color)

    const onColorChange = (e) => {
        setColorSelected(e)
    };

    const onColorSelect = async (e) => {
        let obj = {
            colorOne,
            colorTwo,
            colorThree,
            colorFour
        }
        obj[name] = e
        dispatch(change(obj))
        setColorPickerShow(false);
        await SecureStore.setItemAsync('colors', JSON.stringify(obj))
    }

    const OnBlockClick = () => {
        setColorPickerShow(true);
    }

    const styles = StyleSheet.create({
        Block: {
            width: Dimensions.get("window").width - 20,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: color,
            marginTop: 10,
        },
        text: {
            color: colorThree
        }
    });

    return (
        <TouchableComponent onPress={OnBlockClick}>
            <View style={styles.Block}>
                <Text style={styles.text}>{text}</Text>
                <View>
                    <Modal visible={colorPickerShow}>
                        <View>
                            <ColorPicker
                                oldColor={color}
                                color={toHsv(colorSelected)}
                                onColorChange={onColorChange}
                                onColorSelected={onColorSelect}
                                style={{
                                    width: Dimensions.get("window").width,
                                    height: Dimensions.get("window").width,
                                }}
                            />
                        </View>
                    </Modal>
                </View>
            </View>
        </TouchableComponent>
    );
}

const SettingScreen = () => {
    const dispatch = useDispatch();
    const { colorOne, colorTwo, colorThree, colorFour } = useSelector((state) => state);

    const styles = StyleSheet.create({
        main: {
            alignItems: 'center',
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: colorTwo
        },
        button: {
            marginTop: 20
        },
        label: {
            fontWeight: 'bold',
            fontSize: 18,
            color: colorOne,
            width: Dimensions.get('window').width,
            padding: 10,
            color: colorThree
        },
    });

    const resetColorsHandler = async () => {
        const colorObj = {
            colorOne: '#226ce0',
            colorTwo: '#f3f3f3',
            colorThree: '#000000',
            colorFour: '#ff6663'
        }
        dispatch(change(colorObj))
        await SecureStore.setItemAsync('colors', JSON.stringify(colorObj))
    }

    return (
        <ScrollView>
            <View style={styles.main}>
                <Text style={styles.label}>Colors</Text>
                <BlockColor name='colorOne' color={colorOne} text="Color 1" />
                <BlockColor name="colorTwo" color={colorTwo} text="Color 2" />
                <BlockColor name="colorThree" color={colorThree} text="Color 3" />
                <BlockColor name="colorFour" color={colorFour} text="Color 4" />
                <Button text="Recet colors" onPress={resetColorsHandler} style={styles.button} width={Dimensions.get("window").width - 20} />
            </View>
        </ScrollView>
    );
};

export default SettingScreen;
