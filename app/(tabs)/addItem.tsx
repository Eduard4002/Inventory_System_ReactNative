import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

import React, { useMemo, useState } from "react";
import { icons } from "@/constants/icons";
import TextInputCustom from "@/components/Inputs/TextInputCustom";
import DateInputCustom from "@/components/Inputs/DateInputCustom";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
import useFetch from "@/services/usefetch";
import { fetchEnum, fetchItems, insertItem } from "@/services/api";
import { Tables, Enums } from "@/database.types";
const AddItem = () => {
  const {
    data: measurement_type_raw,
    loading: measurementLoading,
    error: measurementError,
  } = useFetch(() => fetchEnum("measurement_type"));

  const measurement_type = useMemo(
    () =>
      (measurement_type_raw as string[] | undefined)?.map((item) => ({
        label: item,
        value: item,
      })),
    [measurement_type_raw]
  );
  const {
    data: room_type_raw,
    loading: roomLoading,
    error: roomError,
  } = useFetch(() => fetchEnum("room_type"));
  const room_type = useMemo(
    () =>
      (room_type_raw as string[] | undefined)?.map((item) => ({
        label: item,
        value: item,
      })),
    [room_type_raw]
  );
  const handleSave = async () => {
    if (!item.name || !item.amount || !item.measurement_amount) {
      console.log(
        "Validation failed: Name, Amount, and Measurement Amount are required."
      );
      //TODO: "Not sure if I want to keep the alert on or not, but I will keep it for now"
      alert("Please fill in all required fields:");
      return;
    }

    try {
      const insertedItem = await insertItem(item as Tables<"Item">);
      console.log("Inserted item: ", insertedItem);
    } catch (error) {
      console.error("Error inserting item: ", error);
      alert("Failed to save the item. Please try again.");
    }
  };
  console.log("refreshing...");

  const [item, setItem] = useState<Tables<"Item">>({
    amount: 1,
    created_at: new Date(Date.now()).toLocaleDateString(),
    expiry_date: new Date(Date.now()).toLocaleDateString(),
    measurement_amount: null,
    measurement_type:
      Array.isArray(measurement_type_raw) && measurement_type_raw.length > 0
        ? (measurement_type_raw[0] as Enums<"measurement_type">)
        : null,
    name: "",
    price: null,
    room_type:
      Array.isArray(room_type_raw) && room_type_raw.length > 0
        ? (room_type_raw[0] as Enums<"room_type">)
        : null,
  });
  return (
    <View className="flex-1 bg-primary pt-8">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="items-center">
          <View className="flex-row  p-2 mx-2  border-2 border-accent rounded-md bg-dark-100 self-stretch items-center justify-center">
            <Text className="text-white text-4xl font-bold">Add Item</Text>
          </View>
          {measurementError ? (
            <Text className="text-red-600">
              Error: {measurementError?.message}
            </Text>
          ) : null}
          {roomError ? (
            <Text className="text-red-600">Error: {roomError?.message}</Text>
          ) : null}
          {measurementLoading || roomLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : (
            <>
              <TextInputCustom
                onChangeText={(text) => setItem({ ...item, name: text })}
                placeholder="Brasno"
                title="Name"
              />
              <TextInputCustom
                onChangeText={(text) =>
                  setItem({ ...item, price: parseFloat(text) })
                }
                placeholder="19"
                title="Price"
                inputMode="decimal"
              />
              <TextInputCustom
                onChangeText={(text) =>
                  setItem({ ...item, measurement_amount: parseFloat(text) })
                }
                placeholder="5"
                title="Measurement Amount"
                inputMode="decimal"
              />
              <DropdownInputCustom
                data={measurement_type}
                title="Measurement Type"
                onValueChange={(text) =>
                  setItem({
                    ...item,
                    measurement_type: text as keyof typeof measurement_type_raw,
                  })
                }
              />
              <DropdownInputCustom
                data={room_type}
                title="Room Name"
                onValueChange={(text) =>
                  setItem({
                    ...item,
                    room_type: text as keyof typeof room_type_raw,
                  })
                }
              />

              <DateInputCustom
                onDateChange={(text) =>
                  setItem({
                    ...item,
                    expiry_date: new Date(text).toLocaleDateString(),
                  })
                }
                title="Expiry Date"
              />
              <TextInputCustom
                onChangeText={(text) =>
                  setItem({ ...item, amount: parseFloat(text) })
                }
                placeholder="5"
                title="Amount of Items"
                defaultValue={item.amount?.toString()}
              />
              <View className="mt-4 flex items-center w-full">
                <TouchableOpacity
                  className="bg-accent px-6 py-3 rounded-md"
                  onPress={handleSave}
                >
                  <Text className="text-white font-bold text-xl">SAVE</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({});
