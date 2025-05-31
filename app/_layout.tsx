import { Stack } from "expo-router";
import "expo-dev-client";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import "./globals.css";
import React from "react";
import { StatusBar } from "react-native";
export default function RootLayout() {
  const { hasPermission, requestPermission } = useCameraPermission();

  console.log("Camera permission status:", hasPermission);
  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((status) => {
        console.log("Camera permission requested, status:", status);
      });
    }
  }, [hasPermission, requestPermission]);

  return (
    <>
      <StatusBar barStyle={"dark-content"} animated={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="items/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
