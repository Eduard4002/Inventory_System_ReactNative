import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Database, Tables, Enums } from "@/database.types";

const ItemCard = ({
  id,
  name,
  measurement_type,
  measurement_amount,
  room_type,
  price,
  expiry_date,
  amount,
}: Tables<"Item">) => {
  return (
    <Link href={`/items/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={images.highlight}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-sm text-white mt-2" numberOfLines={1}>
          {name} ({measurement_amount} {measurement_type})
        </Text>
        <View className="flex-row items-center justify-start gap-x-1">
          {/*<Image source={icons.star} className="size-4" />*/}
          <Text className="text-xs text-white font-bold uppercase">
            {amount} st
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1"></Text>
          {/* <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text> */}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ItemCard;

const styles = StyleSheet.create({});
