import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import React from "react";
import { fetchItems, updateAmount } from "@/services/api";
import useFetch from "@/services/usefetch";
import { Tables } from "@/database.types";
import { images } from "@/constants/images";
interface ItemInfoProps {
  label: string;
  value?: string | number | null;
}
const ItemInfo = ({ label, value }: ItemInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-l">{label}</Text>
    <Text className="text-light-100 font-bold text-l mt-2">
      {value || "N/A"}
    </Text>
  </View>
);
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

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={images.highlight}
            className="w-full h-[400px]"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute top-5 left-5 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={router.back}
          >
            <Image
              source={icons.arrow}
              className="w-6 h-7 ml-1 rotate-180"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5 border-t-2 border-accent pt-2">
          <Text className="text-white font-bold text-2xl">
            {item?.name} ({item?.measurement_amount} {item?.measurement_type})
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-l">{item?.amount} st</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Text className="text-white font-bold text-l">Expires in:</Text>

            <Text className="text-light-200 text-l">{item?.expiry_date}</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Text className="text-white font-bold text-l">Created in:</Text>

            <Text className="text-light-200 text-l">{item?.created_at}</Text>
          </View>

          <View className="flex flex-row justify-between w-1/2">
            <ItemInfo label="Found in: " value={`${item?.room_type}`} />
            <ItemInfo label="Price per item:" value={`${item?.price} kr`} />
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
  );
};

export default ItemDetails;
