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
    <Link href={`/items/${id}`} asChild key={id}>
      <TouchableOpacity className="w-[45%]">
        <View className="rounded-lg bg-dark-100">
          <Image
            className="w-full h-52 rounded-lg bg-dark-200"
            resizeMode="cover"
          />
          <View className="p-1">
            <Text
              className="text-lg text-white mt-2 font-bold"
              numberOfLines={1}
            >
              {name} ({measurement_amount} {measurement_type})
            </Text>
            <View className="flex-row items-center justify-start gap-x-1">
              {/*<Image source={icons.star} className="size-4" />*/}
              <Text className="text-sm text-white font-bold uppercase">
                {amount} st
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-light-300 font-medium mt-1"></Text>
              {/* <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ItemCard;

const styles = StyleSheet.create({});
