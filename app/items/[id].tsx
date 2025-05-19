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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import React from "react";
import { fetchItems, updateAmount } from "@/services/api";
import useFetch from "@/services/usefetch";
import { Tables } from "@/database.types";
import { images } from "@/constants/images";
import { background } from "@/constants/background";
interface ItemInfoProps {
  label: string;
  value?: string | number | null;
}
const ItemInfo = (item: any) => {
  return (
    <View className="flex-row items-center mt-2 p-2 border-2 border-accent rounded-md bg-dark-100">
      <Text className="text-text-title font-bold text-l">{item.label}</Text>
      <Text className="text-text-title text-l">{item.value}</Text>
    </View>
  );
};
const ItemDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Count to keep track of the amount to save

  const {
    data: item,
    loading: itemsLoading,
    error: itemsError,
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
      console.log("Item updated successfully:", updatedData);
    } else {
      console.error("Item ID is undefined. Cannot update.");
    }
  };
  React.useEffect(() => {
    console.log("Updated tempAmount:", tempAmount);
  }, [tempAmount]);
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
      style={{ flex: 1 }}
    >
      <View className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View>
            <Image
              className="w-full h-[400px] rounded-lg bg-black"
              resizeMode="cover"
            />
          </View>

          <View className="flex-col items-start justify-center mt-5 px-5 border-t-4 border-accent pt-2 ">
            <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent rounded-md bg-dark-100">
              {item?.name} ({item?.measurement_amount} {item?.measurement_type})
            </Text>
            <FlatList
              data={ItemInformation}
              numColumns={2}
              renderItem={ItemInfo}
              keyExtractor={(item) => item.label}
            />
            <View className="border-4 border-red-500 w-full grid grid-cols-2 grid-rows-2 gap-4">
              <ItemInfo label="Amount: " value={`${item?.amount} st`} />
              <ItemInfo label="Expires in: " value={`${item?.expiry_date}`} />
              <ItemInfo label="Added in: " value={`${item?.created_at}`} />
              <ItemInfo label="Found in: " value={`${item?.room_type}`} />
              <ItemInfo
                label="Price per item:"
                value={item?.price ? `${item.price} kr` : "Price not provided"}
              />
            </View>
          </View>
          <View className="flex-row items-start justify-between mt-5 p-4  border-2 border-accent rounded-md bg-dark-100">
            <TouchableOpacity
              className="bg-red-600 px-6 py-3 rounded-md"
              onPress={handleDecrease}
            >
              <Text className="text-white font-bold text-2xl">-</Text>
            </TouchableOpacity>
            <TextInput
              editable={false}
              className="text-white font-bold text-xl "
              value={tempAmount.toString()} // Bind tempAmount to the value prop
            />

            <TouchableOpacity
              className="bg-green-600 px-6 py-3 rounded-md"
              onPress={handleIncrease}
            >
              <Text className="text-white font-bold text-2xl">+</Text>
            </TouchableOpacity>
          </View>
          {/* Conditionally render the Save button */}
          {tempAmount !== item?.amount && (
            <View className="mt-4 flex items-center w-full">
              <TouchableOpacity
                className="bg-accent px-6 py-3 rounded-md"
                onPress={handleSave}
              >
                <Text className="text-white font-bold text-xl">SAVE</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default ItemDetails;
