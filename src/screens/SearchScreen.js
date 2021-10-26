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
    TextInput
} from "react-native";
import Axios from "axios";
import { baseURL } from "../constants";
import Button from "../Components/Button";
import Item from "../Components/Item";
import { FontAwesome5 } from '@expo/vector-icons';
import TouchableComponent from "../Components/TouchableComponent";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = (props) => {
    const { navigation } = props;

    const { colorOne, colorTwo, colorThree } = useSelector(state => state);

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isNext, setIsNext] = useState(true);
    const [query, setQuery] = useState('')

    const loadData = async (page) => {
        setIsLoading(true);
        const res = await Axios(`${baseURL}/api/search/${query}/${page}`);
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
            title: 'Search'
        });
    }, []);

    const nextPageHandler = () => {
        if (!isNext) return
        setPage(page + 1);
        loadData(page + 1);
    };
    const previousPageHandler = () => {
        if (page <= 1) return;
        setPage(page - 1);
        loadData(page - 1);
    };

    const RefreshHandler = () => {
        setIsRefreshing(true);
        loadData(page);
    };

    const searchHandler = () => {
        loadData(page);
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
        textInput: {
            borderWidth: 2,
            borderColor: colorOne,
            width: Dimensions.get('window').width - 60,
            paddingHorizontal: 10,
            paddingVertical: 3,
            color: colorThree
        },
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10
        },
        searchIconContainer: {
            backgroundColor: colorOne,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            height: 38
        },
        text: {
            color: colorThree
        }
    });

    return (
        <View style={styles.main}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} value={query} onChangeText={(e) => setQuery(e)} />
                <TouchableComponent onPress={searchHandler}>
                    <View style={styles.searchIconContainer}>
                        <FontAwesome5 name="search" size={24} color={colorTwo} />
                    </View>
                </TouchableComponent>

            </View>
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
                                    screenName="SearchEpicodesScreenStack"
                                />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default HomeScreen;
