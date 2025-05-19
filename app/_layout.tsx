import { Stack } from "expo-router";
import "expo-dev-client";

import "./globals.css";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="items/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
