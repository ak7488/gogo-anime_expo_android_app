import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
} from "react-native";
import Button from "../Components/Button";
import Item from "../Components/Item";
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";

const BookmarkScreen = (props) => {
    const { navigation } = props;
    const { colorTwo, colorThree } = useSelector(state => state)

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [AllBookmarks, setAllBookmarks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadAllBookmarks = async () => {
        const bookmarksJSON = await SecureStore.getItemAsync('bookmark');
        const bookmark = JSON.parse(bookmarksJSON);
        setAllBookmarks(bookmark)
        setData(bookmark.slice(0, 10))
    }

    useEffect(() => {
        loadAllBookmarks();
    }, [])

    const menuClickHandler = () => {
        navigation.openDrawer();
    };

    useEffect(() => {
        navigation.setOptions({
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
            title: 'New season'
        });
    }, [colorThree]);

    const RefreshHandler = async () => {
        await loadAllBookmarks();
        setIsRefreshing(false)
    }

    const nextPageHandler = () => {
        if (page >= Math.ceil(AllBookmarks.length / 10)) return
        const pag = page + 1;
        setPage(pag)
        const SliceOne = (pag - 1) * 10
        const SliceTwo = pag * 10
        setData(AllBookmarks.slice(SliceOne, SliceTwo))
    }
    const previousPageHandler = () => {
        if (page <= 1) return
        const pag = page - 1;
        setPage(pag)
        const SliceOne = (pag - 1) * 10
        const SliceTwo = pag * 10
        setData(AllBookmarks.slice(SliceOne, SliceTwo))
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
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignItems: "center",
        },
        itemContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 150,
            justifyContent: "space-around",
        },
        text: {
            color: colorThree
        }
    });

    return (
        <View style={styles.main}>
            {AllBookmarks.length > 0 && (
                <View style={styles.controlsContainer}>
                    <Button
                        onPress={previousPageHandler}
                        text="Previous"
                        width={Dimensions.get("window").width / 3 - 10}
                    />
                    <Text style={styles.text}>Page: {page}/{Math.ceil(AllBookmarks.length / 10)}</Text>
                    <Button
                        onPress={nextPageHandler}
                        text="Next"
                        width={Dimensions.get("window").width / 3 - 10}
                    />
                </View>
            )}
            <View>
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
                                    screenName="BookmarkEpicodesScreenStack"
                                />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default BookmarkScreen;
