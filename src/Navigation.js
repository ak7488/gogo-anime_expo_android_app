import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import * as Notifications from 'expo-notifications';

import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import TagsScreen from "./screens/TagsScreen";
import BookmarkScreen from "./screens/BookmarkScreen";
import EpicodesScreen from "./screens/EpicodesScreen";
import VideoScreen from "./screens/VideoScreen";
import SettingScreen from "./screens/SettingScreen";
import PopularScreen from "./screens/PopularScreen";
import NewSeasonScreen from "./screens/NewSeasonScreen";
import { change } from "./store/action";
import { useEffect } from "react";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreenStack"
                component={HomeScreen}
                options={options}
            />
            <Stack.Screen
                name="EpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="VideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const PopularStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PopularHomeScreenStack"
                component={PopularScreen}
                options={options}
            />
            <Stack.Screen
                name="PopularEpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="PopularVideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const NewSeasonStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="NewSeasonHomeScreenStack"
                component={NewSeasonScreen}
                options={options}
            />
            <Stack.Screen
                name="NewSeasonEpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="NewSeasonVideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const SearchStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SearchScreenStack"
                component={SearchScreen}
                options={options}
            />
            <Stack.Screen
                name="SearchEpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="SearchVideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const BookmarkStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BookmarkScreenStack"
                component={BookmarkScreen}
                options={options}
            />
            <Stack.Screen
                name="BookmarkEpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="BookmarkVideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const TagsStack = () => {
    const { colorTwo, colorThree } = useSelector((state) => state);

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TagsScreenStack"
                component={TagsScreen}
                options={options}
            />
            <Stack.Screen
                name="TagsEpicodesScreenStack"
                component={EpicodesScreen}
                options={options}
            />
            <Stack.Screen
                name="TagsVideoScreenStack"
                component={VideoScreen}
                options={options}
            />
        </Stack.Navigator>
    );
};

const Navigator = () => {
    const { colorOne, colorTwo, colorThree, colorFour } = useSelector(
        (state) => state
    );
    const dispatch = useDispatch();
    const initColor = async () => {
        const colorsJSON = await SecureStore.getItemAsync("colors");
        if (colorsJSON) {
            const colors = JSON.parse(colorsJSON);
            dispatch(change(colors));
        } else {
            const colorObj = {
                colorOne: "#226ce0",
                colorTwo: "#f3f3f3",
                colorThree: "#000000",
                colorFour: "#ff6663",
            };
            await SecureStore.setItemAsync("colors", JSON.stringify(colorObj));
        }
    };

    const options = {
        headerStyle: {
            backgroundColor: colorTwo,
            borderColor: colorThree,
            borderBottomWidth: 2,
        },
        headerTintColor: colorThree,
    };

    useEffect(() => {
        initColor();
    }, []);

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    }, [])

    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: colorTwo,
                    },
                    drawerInactiveTintColor: colorThree,
                    drawerActiveTintColor: colorThree,
                    drawerActiveBackgroundColor: colorOne,
                    drawerInactiveBackgroundColor: "#e0dede",
                }}
            >
                <Drawer.Screen
                    name="Home"
                    component={HomeStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="Search"
                    component={SearchStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="Bookmark"
                    component={BookmarkStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="Popular"
                    component={PopularStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="NewSeason"
                    component={NewSeasonStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="Tags"
                    component={TagsStack}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="Setting"
                    component={SettingScreen}
                    options={options}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
