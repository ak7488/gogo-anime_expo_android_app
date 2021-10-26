import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import TouchableComponent from './TouchableComponent';

const Item = ({ item, navigation, screenName }) => {
    const { anime_id, img_url, name } = item;
    const { colorOne, colorTwo } = useSelector(state => state);

    const EpicodesScreenRedirectHandler = () => {
        navigation.navigate(screenName, { item })
    }

    const styles = StyleSheet.create({
        img: {
            width: '100%',
            height: Dimensions.get('window').width / 2 + 50,
        },
        item: {
            width: Dimensions.get('window').width / 2 - 10,
            overflow: 'hidden',
            marginVertical: 15,
            backgroundColor: colorOne
        },
        text: {
            color: colorTwo,
            padding: 5
        }
    })
    return (
        <TouchableComponent onPress={EpicodesScreenRedirectHandler}>
            <View style={styles.item}>
                <Image source={{ uri: img_url }} style={styles.img} />
                <Text style={styles.text}>{name}</Text>
            </View>
        </TouchableComponent>
    )
};

export default Item;