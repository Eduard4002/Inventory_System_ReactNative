import { ImageBackground, StyleSheet, Text, View, Image } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";

import React from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View className="flex-row min-w-[112px] min-h-14 mt-2">
      {focused ? (
        <View className=" flex-row w-full max-h-14 justify-center items-center overflow-hidden bg-dark-200 ">
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
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarBackground() {
          return (
            <BlurView
              blurReductionFactor={10}
              experimentalBlurMethod="dimezisBlurView"
              intensity={100}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          );
        },

        tabBarStyle: {
          position: "absolute",
        },

        tabBarHideOnKeyboard: true,
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
