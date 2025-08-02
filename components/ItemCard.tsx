import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Database, Tables, Enums } from "@/database.types";
import { background } from "@/constants/background";

const ItemCard = ({
  id,
  name,
  measurement_type,
  measurement_amount,
  room_type,
  price,
  expiry_date,
  amount,
  image_url,
}: Tables<"Item">) => {
  return (
    <Link href={`/items/${id}`} asChild key={id}>
      <TouchableOpacity style={{ height: 256, width: "45%" }}>
        <View className="rounded-lg bg-dark-100">
          <Image
            className=" rounded-lg bg-dark-200"
            resizeMode="cover"
            style={{ width: "100%", height: 208 }}
            source={image_url ? { uri: image_url } : background.bg3}
          />
          <View className="p-1">
            <Text
              className="text-lg text-white mt-2 font-bold"
              numberOfLines={1}
            >
              {name} ({measurement_amount} {measurement_type})
            </Text>
            <View className="flex-row items-center justify-start gap-x-1">
              <Text className="text-sm text-white font-bold uppercase">
                {amount} st
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-light-300 font-medium mt-1"></Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ItemCard;

const styles = StyleSheet.create({});
