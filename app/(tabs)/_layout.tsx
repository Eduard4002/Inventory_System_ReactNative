import { ImageBackground, StyleSheet, Text, View, Image } from "react-native";
import { Tabs } from "expo-router";

import React from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center overflow-hidden bg-red-300">
        <Image source={icon} tintColor="#000000" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    );
  } else {
    return (
      <View className="size-full justify-center items-center mt-4 rounded-full">
        <Image source={icon} tintColor="#000000" />
      </View>
    );
  }
};
const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Items",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Items" />
          ),
        }}
      />
      <Tabs.Screen
        name="addItem"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.star} title="Add" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;

const styles = StyleSheet.create({});
