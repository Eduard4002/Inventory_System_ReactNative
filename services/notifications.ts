import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import supabase from "./supabase";

//import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

let expoPushToken: string | null = null;

async function sendPushNotification(
  _title: string,
  _body: string,
  _data: any = {}
) {
  //Expo push token is not set, either not requested or not granted permission
  if (expoPushToken === null) return;

  const message = {
    to: expoPushToken,
    sound: "default",
    title: _title,
    body: _body,
    data: _data,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
export function addNotificationListener() {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
      console.log("Notification data:", notification.request.content.data);
    }
  );

  return notificationListener;
}

export async function requestNotificationPermission() {
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });

  if (!Device.isDevice) {
    throw new Error("Must use physical device for push notifications");
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  if (status !== "granted") {
    throw new Error("Permission not granted for push notifications");
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    throw new Error("Project ID not found");
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await uploadTokenToSupabase(token);

  expoPushToken = token; // store globally
  console.log("Expo push token:", expoPushToken);
  return expoPushToken;
}
async function uploadTokenToSupabase(token: string) {
  const { error } = await supabase.from("Device_Token").insert({ token });
  if (error) console.error("Failed to store token", error);
}
//This is information when the app is in the foreground, if we should show the notification. I will keep it on for now, but it can be removed if not needed.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export function addNotificationResponseListener() {
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
      console.log(
        "Notification data:",
        response.notification.request.content.data
      );
    });
  return responseListener;
}
