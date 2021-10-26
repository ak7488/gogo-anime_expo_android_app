import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from "react-native";
import Axios from "axios";
import { baseURL } from "../constants";
import Button from "../Components/Button";
import Item from "../Components/Item";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";

const TagScreen = (props) => {

    const { colorOne, colorTwo, colorThree } = useSelector(state => state);

    const tags = [
        'Action', 'Adventure', 'Cars',
        'Comedy', 'Crime', 'Dementia',
        'Demons', 'Drama', 'Dub',
        'Ecchi', 'Family', 'Fantasy',
        'Game', 'Harem', 'Hentai',
        'Historical', 'Horror', 'Josei',
        'Kids', 'Magic', 'Martial Arts',
        'Mecha', 'Military', 'Music',
        'Mystery', 'Parody', 'Police',
        'Psychological', 'Romance', 'Samurai',
        'School', 'Sci-Fi', 'Seinen',
        'Shoujo', 'Shoujo Ai', 'Shounen',
        'Shounen Ai', 'Slice of Life', 'Space',
        'Sports', 'Super Power', 'Supernatural',
        'Thriller', 'Vampire', 'Yaoi',
        'Yuri'
    ]

    const { navigation } = props;

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isNext, setIsNext] = useState(true);
    const [selectedTag, setSelectedTag] = useState('')

    const loadData = async (page, Tag) => {
        setIsLoading(true);
        const res = await Axios(`${baseURL}/api/tag/${Tag.replace(/ /g, '-')}/${page}`);
        setData(res.data[0]);
        const isNext = res.data[1].includes((page + 1).toString());
        setIsNext(isNext)

        setIsLoading(false);
        setIsRefreshing(false);
    };

    const menuClickHandler = () => {
        navigation.openDrawer();
    };

    useEffect(() => {
        const title = selectedTag ? selectedTag : 'Tags'
        navigation.setOptions({
            title,
            headerRight: () => {
                if (selectedTag) {
                    return (
                        <View style={{ paddingRight: 10 }}>
                            <MaterialIcons name="cancel" size={28} color={colorOne} onPress={() => {
                                setSelectedTag('')
                                setData([])
                            }} />
                        </View>
                    )
                }
            },
            headerLeft: () => (
                <View style={{ paddingRight: 10 }}>
                    <Ionicons
                        onPress={menuClickHandler}
                        name="menu"
                        size={26}
                        color={colorThree}
                    />
                </View>
            ),
        });
    }, [selectedTag]);

    const nextPageHandler = () => {
        if (!isNext) return
        setPage(page + 1);
        loadData(page + 1, selectedTag);
    };
    const previousPageHandler = () => {
        if (page <= 1) return;
        setPage(page - 1);
        loadData(page - 1, selectedTag);
    };

    const RefreshHandler = () => {
        setIsRefreshing(true);
        loadData(page, selectedTag);
    };

    const searchHandler = (e) => {
        loadData(page, e);
        setSelectedTag(e);
    }

    const styles = StyleSheet.create({
        main: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: colorTwo
        },
        controlsContainer: {
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            alignItems: "center",
        },
        noImformationContainer: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height - 100,
            justifyContent: "center",
            alignItems: "center",
        },
        modal: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
        },
        itemContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 240,
            justifyContent: "space-around",
        },
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            marginVertical: 10,
        },
        text: {
            color: colorThree
        }
    });

    return (
        <View style={styles.main}>
            {selectedTag === '' && <ScrollView>
                <View style={styles.tagContainer}>
                    {tags.map((e, index) => {
                        return (
                            <Button
                                key={"TagButton" + index}
                                text={e}
                                width={Dimensions.get("window").width / 2 - 10}
                                style={{
                                    margin: 5
                                }}
                                onPress={() => {
                                    searchHandler(e)
                                }}
                            />
                        )
                    })}
                </View>
            </ScrollView>}
            {data.length > 0 && (
                <View style={styles.controlsContainer}>
                    <Button
                        onPress={previousPageHandler}
                        text="Previous"
                        width={Dimensions.get("window").width / 3 - 10}
                    />
                    <Text style={styles.text}>Page: {page}</Text>
                    <Button
                        onPress={nextPageHandler}
                        text="Next"
                        width={Dimensions.get("window").width / 3 - 10}
                    />
                </View>
            )}
            <Modal visible={isLoading} transparent={true}>
                <View style={styles.modal}>
                    <ActivityIndicator size={38} color={colorOne} />
                </View>
            </Modal>
            {selectedTag !== '' && <View>
                {data.length === 0 ? (
                    <View style={styles.noImformationContainer}>
                        <Text style={styles.text}>No information!</Text>
                    </View>
                ) : (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                onRefresh={RefreshHandler}
                                refreshing={isRefreshing}
                            />
                        }
                    >
                        <View style={styles.itemContainer}>
                            {data.map((item, index) => (
                                <Item
                                    navigation={navigation}
                                    key={"item" + index}
                                    item={item}
                                    screenName="TagsEpicodesScreenStack"
                                />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>}
        </View>
    )
};

const styles = StyleSheet.create({})

export default TagScreen;