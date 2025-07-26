import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { Platform } from "react-native";
import { Tables } from "@/database.types";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-access-key": process.env.EXPO_PUBLIC_ACCESS_KEY || "",
    },
  },
});
export const signInWithEmail = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'mihiceduard@gmail.com',
    password: process.env.EXPO_PUBLIC_ACCESS_KEY || "",
  })
  console.log('Sign in data:', data);
  if(error) console.log('Sign in error:', error);
  return data;
}
  signInWithEmail().then((result) => {
    console.log('Sign-in successful:', result);
    supabase.realtime.setAuth(result.session?.access_token || "");
  }).catch((error) => {
    console.error('Error during sign-in:', error);
  });

export default supabase;
