import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import React from "react";
interface ItemInfoProps {
  label: string;
  value?: string | number | null;
}
const ItemInfo = ({ label, value }: ItemInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);
const ItemDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${item?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{item?.name}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {item?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{item?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(item?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({item?.vote_count} votes)
            </Text>
          </View>

          <ItemInfo label="Overview" value={item?.overview} />

          <View className="flex flex-row justify-between w-1/2">
            <ItemInfo
              label="Budget"
              value={`$${(item?.budget ?? 0) / 1_000_000} million`}
            />
            <ItemInfo
              label="Revenue"
              value={`$${Math.round((item?.revenue ?? 0) / 1_000_000)} million`}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemDetails;
