import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ActivityIndicator,
    ScrollView,
    Image,
} from "react-native";
import Axios from "axios";
import { baseURL } from "../constants";
import Button from "../Components/Button";
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux";

const EpicodesScreen = (props) => {
    const item = props.route.params.item;
    const screenName = props.route.name;


    const dataProto = {
        episode_id: [],
        name: "",
        about: "",
        img_url: "",
    };

    const { colorOne, colorFour, colorTwo, colorThree } = useSelector(state => state)

    const [data, setData] = useState(dataProto);
    const [isLoading, setIsLoading] = useState(false);
    const [isBookmarked, setIsBookMarked] = useState(false);

    const loadData = async (name) => {
        setIsLoading(true);
        const res = await Axios(`${baseURL}/api/getAnime/${name}`);

        setData(res.data);
        setIsLoading(false);
    };

    const BookmarkCheckHanlder = async () => {
        const jsonData = await SecureStore.getItemAsync('bookmark');
        if (jsonData) {
            const data = JSON.parse(jsonData)
            data.forEach(e => {
                if (e.name === item.name) {
                    setIsBookMarked(true);
                }
            })
        } else {
            await SecureStore.setItemAsync('bookmark', JSON.stringify([]))
        }
    }

    const addToBookMarkHandler = async () => {
        const jsonData = await SecureStore.getItemAsync('bookmark');
        const data = JSON.parse(jsonData)
        await SecureStore.setItemAsync('bookmark', JSON.stringify([...data, item]))
        setIsBookMarked(true);
    }

    const removeFromBookmarkHandler = async () => {
        const jsonData = await SecureStore.getItemAsync('bookmark');
        let data = JSON.parse(jsonData);
        data = data.filter(e => e.name !== item.name);
        await SecureStore.setItemAsync('bookmark', JSON.stringify(data))
        setIsBookMarked(false)
    }

    useEffect(() => {
        if (item) {
            let name = item.img_url.split("/").reverse()[0].replace(".png", "");
            loadData(name);
        }
        BookmarkCheckHanlder()
    }, [item]);

    useEffect(() => {
        props.navigation.setOptions({
            title: data.name
        });
    }, [data]);

    const onEpicodeButtonClick = (id) => {
        let redirectScreenName = '';
        if (screenName === 'EpicodesScreenStack') {
            redirectScreenName = 'VideoScreenStack'
        } else if (screenName === 'PopularEpicodesScreenStack') {
            redirectScreenName = 'PopularVideoScreenStack'
        } else if (screenName === 'NewSeasonEpicodesScreenStack') {
            redirectScreenName = 'NewSeasonVideoScreenStack'
        } else if (screenName === 'SearchEpicodesScreenStack') {
            redirectScreenName = 'SearchVideoScreenStack'
        } else if (screenName === 'BookmarkEpicodesScreenStack') {
            redirectScreenName = 'BookmarkVideoScreenStack'
        } else if (screenName === 'TagsEpicodesScreenStack') {
            redirectScreenName = 'TagsVideoScreenStack'
        }
        props.navigation.navigate(redirectScreenName, {
            id,
            name: data.name,
            episodes: data.episode_id
        })
    }

    const styles = StyleSheet.create({
        modal: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
        },

        main: {
            width: Dimensions.get("window").width,
            backgroundColor: colorTwo
        },

        img: {
            width:
                Dimensions.get("window").width -
                Dimensions.get("window").width / 3,
            height:
                Dimensions.get("window").width -
                Dimensions.get("window").width / 3 +
                70,
        },
        imgContainer: {
            width: Dimensions.get("window").width,
            alignItems: "center",
            padding: 20,
        },
        imgPlaceHolder: {
            width:
                Dimensions.get("window").width -
                Dimensions.get("window").width / 3,
            height:
                Dimensions.get("window").width -
                Dimensions.get("window").width / 3 +
                70,
            backgroundColor: colorOne,
        },
        name: {
            padding: 10,
            fontSize: 18,
            fontWeight: "bold",
            color: colorOne,
        },
        about: {
            padding: 10,
            color: colorThree
        },
        episodeButtonContainer: {
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 10
        },
    });

    return (
        <ScrollView>
            <View style={styles.main}>
                <Modal visible={isLoading} transparent={true}>
                    <View style={styles.modal}>
                        <ActivityIndicator size={38} color={colorOne} />
                    </View>
                </Modal>
                <View style={styles.imgContainer}>
                    <View style={styles.imgPlaceHolder}>
                        {data.img_url !== "" && (
                            <Image
                                source={{ uri: data.img_url }}
                                style={styles.img}
                            />
                        )}
                    </View>
                </View>
                <View>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.about}>{data.about}</Text>
                </View>
                <View>
                    <Button
                        text={isBookmarked ? 'Remove from bookmark' : 'Add to Bookmark'}
                        width={Dimensions.get("window").width - 20}
                        style={{
                            margin: 10
                        }}
                        bgColor={isBookmarked ? colorFour : colorOne}
                        onPress={isBookmarked ? removeFromBookmarkHandler : addToBookMarkHandler}
                    />
                </View>
                <View style={styles.episodeButtonContainer}>
                    {data.episode_id.map((id, index) => {
                        return (
                            <Button
                                key={"epButton" + index}
                                text={id}
                                width={Dimensions.get("window").width - 20}
                                style={{
                                    margin: 5
                                }}
                                onPress={() => {
                                    onEpicodeButtonClick(id)
                                }}
                            />
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

export default EpicodesScreen;
