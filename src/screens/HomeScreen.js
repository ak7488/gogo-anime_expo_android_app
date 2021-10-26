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
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const HomeScreen = (props) => {
    const { navigation, route } = props;

    const { colorOne, colorThree, colorTwo } = useSelector(state => state)

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isNext, setIsNext] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        const res = await Axios(`${baseURL}/api/recent/${page}`);
        setData(res.data);

        setIsLoading(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadData();

        return () => loadData()
    }, [page]);

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
            title: 'Home'
        });
    }, [colorThree]);

    const nextPageHandler = () => {
        if (page >= 50 && route.name !== "NewSeason") return;
        if (route.name === 'NewSeason' && !isNext) return
        setPage(page + 1);
    };
    const previousPageHandler = () => {
        if (page <= 1) return;
        setPage(page - 1);
    };

    const RefreshHandler = () => {
        setIsRefreshing(true);
        loadData();
    };

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
            marginBottom: 150,
            justifyContent: "space-around",
        },
        text: {
            color: colorThree
        }
    });

    return (
        <View style={styles.main}>
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
                                    screenName="EpicodesScreenStack"
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
