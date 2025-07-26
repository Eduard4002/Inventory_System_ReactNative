import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import React, { useEffect, useState } from "react";
import { fetchItems, updateAmount } from "@/services/api";
import useFetch from "@/services/usefetch";
import { Tables } from "@/database.types";
import { images } from "@/constants/images";
import { background } from "@/constants/background";
import { BlurView } from "expo-blur";

const _renderItem = ({ item }: { item: { label: string; value: string } }) => (
  <View
    style={{ width: "47%" }}
    className="flex-row items-center mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100 overflow-auto"
  >
    <Text className="text-text-title font-bold text-l">{item.label}: </Text>
    <Text className="text-text-title text-l">{item.value}</Text>
  </View>
);
const windowDimensions = Dimensions.get("window");

const ItemDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });
  //Get the dimensions of the screen, so the background image can be set to the size of the screen
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  // Count to keep track of the amount to save

  const {
    data: item,
    loading: itemsLoading,
    error: itemsError,
    refetch,
  } = useFetch<Tables<"Item">>(async () => {
    const result = await fetchItems({ ID: Number(id) });
    return Array.isArray(result) ? result[0] : result;
  });
  const [tempAmount, setTempAmount] = React.useState(0);

  // Update tempAmount when item data is fetched
  React.useEffect(() => {
    if (item?.amount) {
      setTempAmount(item.amount);
    }
  }, [item]);

  // Custom functions for button presses
  const handleDecrease = () => {
    setTempAmount((prevAmount) => {
      if (prevAmount > 0) {
        return prevAmount - 1;
      }
      return prevAmount; // Prevent going below 0
    });
  };

  const handleIncrease = () => {
    setTempAmount((prevAmount) => prevAmount + 1);
  };
  const handleSave = async () => {
    if (item?.id !== undefined) {
      const updatedData = await updateAmount(item.id, tempAmount);
      if (tempAmount <= 0) {
        //go back to the index page since the item was deleted
        router.back();
        return;
      }
      refetch(); // Refetch the item data to reflect changes
      console.log("Item updated successfully:", updatedData);
    } else {
      console.error("Item ID is undefined. Cannot update.");
    }
  };
  const ItemInformation = [
    {
      label: "Amount",
      value: `${item?.amount} st`,
    },
    {
      label: "Expires in",
      value: `${item?.expiry_date}`,
    },
    {
      label: "Added in",
      value: `${item?.created_at}`,
    },
    {
      label: "Found in",
      value: `${item?.room_type}`,
    },
    {
      label: "Price per item",
      value: item?.price ? `${item.price} kr` : "Price not provided",
    },
  ];
  return (
    <ImageBackground
      source={background.bg5}
      resizeMode="cover"
      style={{
        flex: 1,
        width: dimensions.window.width,
        height: dimensions.window.height,
      }}
      blurRadius={2}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {itemsLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : itemsError ? (
          <Text className="text-red-600">Error: {itemsError?.message}</Text>
        ) : item ? (
          <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center ">
            <View
              style={{ height: dimensions.window.height * 0.4 }}
              className="p-6 "
            >
              <Image
                style={{ height: "100%", width: "100%" }}
                className="rounded-lg"
                resizeMode="cover"
                source={
                  item?.image_url ? { uri: item?.image_url } : background.bg3
                }
              />
            </View>

            <View className="flex-col items-start justify-center mt-5 px-4 ">
              <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                {item?.name} ({item?.measurement_amount}{" "}
                {item?.measurement_type})
              </Text>
              <FlatList
                style={{ width: "100%" }}
                data={ItemInformation}
                numColumns={2}
                renderItem={_renderItem}
                keyExtractor={(item) => item.label}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  flex: 1,
                  gap: 6, // Add spacing between columns
                  marginBottom: 8, // Add spacing between rows
                }}
                contentContainerStyle={{
                  paddingVertical: 8,
                  gap: 0,
                }}
                scrollEnabled={false} // Prevent FlatList from scrolling inside ScrollView
              />

              <View className="flex-col items-center justify-center mt-5 w-full">
                <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                  UPDATE AMOUNT
                </Text>

                <View className="flex-row items-center justify-between mt-5 p-4  border-2 border-accent-primary rounded-md bg-dark-100 w-3/4 self-center">
                  <TouchableOpacity
                    className="bg-red-600 px-6 py-3 rounded-md"
                    onPress={handleDecrease}
                  >
                    <Text className="text-white font-bold text-2xl">-</Text>
                  </TouchableOpacity>
                  <Text className="text-white font-bold text-2xl  ">
                    {tempAmount.toString()}
                  </Text>

                  <TouchableOpacity
                    className="bg-green-600 px-6 py-3 rounded-md"
                    onPress={handleIncrease}
                  >
                    <Text className="text-white font-bold text-2xl">+</Text>
                  </TouchableOpacity>
                </View>
                {tempAmount !== item?.amount && (
                  <View className="text-text-title w-1/2 flex items-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                    <TouchableOpacity
                      className="bg-accent-dark px-6 py-3 rounded-md w-full"
                      onPress={handleSave}
                    >
                      <Text className="text-white font-bold text-xl text-center">
                        SAVE
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
};

export default ItemDetails;
