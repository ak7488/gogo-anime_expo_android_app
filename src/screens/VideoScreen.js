import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Dimensions,
    Linking,
    ScreenO,
} from "react-native";
import Axios from "axios";
import { baseURL } from "../constants";
import Button from "../Components/Button";
import { Video } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";
import TouchableComponent from "../Components/TouchableComponent";
import * as Fs from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";

const DownloadModalButtonContainer = ({
    inDirectDownloadLink = [],
    directDownloadLink = [],
    setIsDownloadModalShow = () => {},
    id,
}) => {
    const { colorFour, colorTwo } = useSelector((state) => state);

    const saveFile = async (uri) => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync("Download", asset, false).then(
                async (e) => {
                    const { status } =
                        await Notifications.requestPermissionsAsync();
                    if (status === "granted") {
                        await Notifications.scheduleNotificationAsync({
                            trigger: {
                                seconds: 1,
                            },
                            content: {
                                title: "Finish download",
                                body: id,
                            },
                        });
                    }
                }
            );
        }
    };

    const downloadHandler = async (link) => {
        const name = `${id}-${Math.random().toString().replace(/\./g, "")}.mp4`;
        const fileURI = Fs.documentDirectory + name;
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
            await Notifications.scheduleNotificationAsync({
                trigger: {
                    seconds: 0,
                },
                content: {
                    title: "Starting download",
                    body: id,
                },
            });
        }
        Fs.downloadAsync(link, fileURI)
            .then(({ uri }) => {
                saveFile(uri);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const styles = StyleSheet.create({
        downloadModalButtonContainer: {
            padding: 10,
            backgroundColor: colorTwo,
            borderRadius: 10,
            maxHeight: Dimensions.get("window").height - 200,
        },
        text: {
            fontSize: 18,
            fontWeight: "bold",
            color: colorFour,
        },
        center: {
            marginBottom: 20,
        },
    });

    return (
        <View style={styles.downloadModalButtonContainer}>
            <ScrollView>
                <View style={styles.center}>
                    <Text style={styles.text}>Direct download</Text>
                    {directDownloadLink.map((e, index) => (
                        <Button
                            key={"directDownloadButton" + index}
                            text={e.quality}
                            width={Dimensions.get("window").width - 80}
                            style={{
                                margin: 5,
                            }}
                            onPress={() => {
                                setIsDownloadModalShow(false);
                                downloadHandler(e.ep_link);
                            }}
                        />
                    ))}
                    <Text style={styles.text}>Redirect download</Text>
                    {inDirectDownloadLink.map((e, index) => (
                        <Button
                            key={"inDirectDownloadButton" + index}
                            text={e.quality}
                            width={Dimensions.get("window").width - 80}
                            style={{
                                margin: 5,
                            }}
                            onPress={() => {
                                setIsDownloadModalShow(false);
                                Linking.openURL(e.ep_link);
                            }}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const VideoScreen = (props) => {
    const { colorOne, colorTwo, colorThree } = useSelector((state) => state);

    const [selectedQuality, setSelectedQuality] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [inDirectDownloadLink, setInDirectDownloadLink] = useState([]);
    const [isQualtyModalVisible, setIsQualityModalVisible] = useState(false);
    const [isDownloadModalShow, setIsDownloadModalShow] = useState(false);
    const [videoStyle, setVideoStyle] = useState({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width * 0.5625,
    });

    const { episodes, id, name } = props.route.params;

    const loadData = async (query) => {
        try {
            setData([]);
            setInDirectDownloadLink([]);
            setIsLoading(true);
            let res = await Axios(`${baseURL}/api/getEpisode/${query}`);
            let e = res.data,
                a = res.data;
            e = e.filter(
                (f) => f.ep_link.includes(".mp4") && f.quality.includes("watch")
            );
            a = a.filter((g) => !g.quality.includes("watch"));
            setData(e);
            setInDirectDownloadLink(a);
            setIsQualityModalVisible(true);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        loadData(id);
    }, [id]);

    useEffect(() => {
        props.navigation.setOptions({
            title: name,
        });
    }, [name]);

    useEffect(() => {}, [selectedQuality]);

    const styles = StyleSheet.create({
        modal: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
        },
        videoPlaceHolder: {
            width: videoStyle.width,
            height: videoStyle.height,
            backgroundColor: colorOne,
        },
        episodeButtonContainer: {
            alignItems: "center",
            marginBottom: 20,
            marginTop: 5,
        },
        name: {
            color: colorOne,
            fontSize: 18,
            fontWeight: "bold",
            padding: 10,
        },
        id: {
            padding: 10,
            color: colorThree,
        },
        label: {
            marginTop: 20,
            fontSize: 16,
            fontWeight: "bold",
            color: colorOne,
            padding: 10,
        },
        main: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: colorTwo,
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
                <Modal visible={isQualtyModalVisible} transparent={true}>
                    <View style={styles.modal}>
                        <View>
                            {data.map((e, index) => {
                                return (
                                    <Button
                                        key={"qualityButton" + index}
                                        text={e.quality}
                                        width={
                                            Dimensions.get("window").width - 80
                                        }
                                        style={{
                                            margin: 5,
                                        }}
                                        onPress={() => {
                                            setIsQualityModalVisible(false);
                                            setSelectedQuality(e);
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                </Modal>
                <Modal visible={isDownloadModalShow} transparent={true}>
                    <TouchableComponent
                        onPress={() => setIsDownloadModalShow(false)}
                    >
                        <View style={styles.modal}>
                            <DownloadModalButtonContainer
                                directDownloadLink={data}
                                inDirectDownloadLink={inDirectDownloadLink}
                                setIsDownloadModalShow={setIsDownloadModalShow}
                                id={id}
                            />
                        </View>
                    </TouchableComponent>
                </Modal>
                <View style={styles.videoPlaceHolder}>
                    {selectedQuality && selectedQuality.ep_link !== "" && (
                        <Video
                            source={{ uri: selectedQuality.ep_link }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="contain"
                            shouldPlay
                            isLooping={false}
                            useNativeControls
                            onReadyForDisplay={(e) => {
                                const { width, height } = e.naturalSize;
                                const aspect = width / height;
                                const deviceWidth =
                                    Dimensions.get("window").width;
                                setVideoStyle({
                                    width: deviceWidth,
                                    height: deviceWidth / aspect,
                                });
                            }}
                            style={videoStyle}
                        />
                    )}
                </View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.id}>{id}</Text>
                <Button
                    text="Change Quality"
                    width={Dimensions.get("window").width - 20}
                    style={{
                        margin: 5,
                        marginTop: 15,
                        marginBottom: 10,
                    }}
                    onPress={() => {
                        setIsQualityModalVisible(true);
                    }}
                />
                <Button
                    text="Download ⬇"
                    width={Dimensions.get("window").width - 20}
                    style={{
                        margin: 5,
                        marginTop: 15,
                        marginBottom: 10,
                    }}
                    onPress={() => {
                        setIsDownloadModalShow(true);
                    }}
                />
                <Text style={styles.label}>Epicodes</Text>
                <View style={styles.episodeButtonContainer}>
                    {episodes.map((id, index) => {
                        return (
                            <Button
                                key={"epButton" + index}
                                text={id}
                                width={Dimensions.get("window").width - 20}
                                style={{
                                    margin: 5,
                                }}
                                onPress={() => {
                                    props.navigation.navigate(
                                        "VideoScreenStack",
                                        {
                                            id,
                                            name: name,
                                            episodes,
                                        }
                                    );
                                }}
                            />
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

export default VideoScreen;
