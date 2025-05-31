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
          height: 56,
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
