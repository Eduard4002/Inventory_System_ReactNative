import React, { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Stack } from "expo-router";
import "expo-dev-client";
import "react-native-url-polyfill/auto";
import "./globals.css";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  addNotificationListener,
  addNotificationResponseListener,
  requestNotificationPermission,
} from "@/services/notifications";
// Conditional imports
let Camera: any = null;
let useCameraDevice: any = null;
let useCameraPermission: any = null;

if (Platform.OS !== "web") {
  const VisionCamera = require("react-native-vision-camera");
  Camera = VisionCamera.Camera;
  useCameraDevice = VisionCamera.useCameraDevice;
  useCameraPermission = VisionCamera.useCameraPermission;
}

export default function RootLayout() {
  const cameraPermission = Platform.OS !== "web" ? useCameraPermission() : null;

  // Single startup flow
  useEffect(() => {
    async function requestAllPermissions() {
      try {
        // Camera
        if (Platform.OS !== "web" && !cameraPermission?.hasPermission) {
          await cameraPermission?.requestPermission();
        }

        // Notifications
        requestNotificationPermission().catch(console.error);
      } catch (err) {
        console.warn("Permission error:", err);
      }
    }

    requestAllPermissions();

    const notificationListener = addNotificationListener();
    const responseListener = addNotificationResponseListener();

    // Cleanup listeners on unmount
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        translucent={true}
        animated={true}
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="items/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
