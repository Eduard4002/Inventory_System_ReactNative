import { ImageBackground, StyleSheet, Text, View, Image } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";

import React from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

import Index from ".";
import AddItem from "./addItem";
import Profile from "./profile";

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View
      style={{ height: 56, width: "100%" }}
      className="flex-row border-2 border-blue-400"
    >
      {focused ? (
        <View className="flex-row w-full justify-center items-center bg-dark-200 ">
          <Image source={icon} tintColor="#a1a1a1" className="size-5" />
          <Text className="text-text-title text-base font-semibold ml-2">
            {title}
          </Text>
        </View>
      ) : (
        <View className="size-full justify-center items-center">
          <Image source={icon} tintColor="#929292" className="size-5" />
        </View>
      )}
    </View>
  );
  /* if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex-row flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden border-2 border-blue-200"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
    <View className="size-full justify-center items-center mt-4 border-2 border-blue-200">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  ); */
};
const _Layout = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="index"
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: "shift",

        tabBarActiveBackgroundColor: "#000000",
        tabBarInactiveTintColor: "#616161",
        tabBarActiveTintColor: "#ececec",
        tabBarBackground() {
          return (
            <BlurView
              intensity={90}
              tint="regular"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          );
        },

        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: "#ececec",
          position: "absolute",
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "index") {
            return <Entypo name="home" size={size} color={color} />;
          } else if (route.name === "addItem") {
            return <Entypo name="plus" size={size} color={color} />;
          } else if (route.name === "profile") {
            return <AntDesign name="profile" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="index" component={Index} />
      <Tab.Screen name="addItem" component={AddItem} />
      <Tab.Screen name="profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default _Layout;

const styles = StyleSheet.create({});
