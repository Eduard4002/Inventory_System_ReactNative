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

import React, { useEffect, useMemo, useState } from "react";
import { icons } from "@/constants/icons";
import TextInputCustom from "@/components/Inputs/TextInputCustom";
import DateInputCustom from "@/components/Inputs/DateInputCustom";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
import useFetch from "@/services/usefetch";
import { fetchEnum, fetchItems, insertItem } from "@/services/api";
import { Tables, Enums } from "@/database.types";
const AddItem = () => {
  const [measurementTypeRaw, setMeasurementTypeRaw] = useState<string[] | null>(
    null
  );
  const [roomTypeRaw, setRoomTypeRaw] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Combined loading state
  const [error, setError] = useState<Error | null>(null);

  // --- Effect to fetch data ONCE on component mount ---
  useEffect(() => {
    console.log("Fetching enum data on mount...");
    setIsLoading(true);
    setError(null);

    // Fetch both enums concurrently
    Promise.all([fetchEnum("measurement_type"), fetchEnum("room_type")])
      .then(([measurementData, roomData]) => {
        console.log("Fetch successful:", measurementData, roomData);
        setMeasurementTypeRaw(measurementData as string[]);
        setRoomTypeRaw(roomData as string[]);

        // --- Set initial default values for dropdowns AFTER data is fetched ---
        setItem((prevItem) => ({
          ...prevItem,
          measurement_type: Array.isArray(measurementData)
            ? (measurementData[0] as Enums<"measurement_type">)
            : null,
          room_type: Array.isArray(roomData)
            ? (roomData[0] as Enums<"room_type">)
            : null,
        }));
        // --- ---
      })
      .catch((err) => {
        console.error("Error fetching enum data:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("An unknown fetch error occurred")
        );
        setMeasurementTypeRaw([]); // Set to empty array on error to avoid issues downstream
        setRoomTypeRaw([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // <-- Empty dependency array means this runs only ONCE on mount

  // --- Memoize dropdown data (derived state) ---
  const measurement_type_options = useMemo(
    () => measurementTypeRaw?.map((val) => ({ label: val, value: val })) ?? [], // Handle null case
    [measurementTypeRaw] // Depends only on the fetched raw data state
  );

  const room_type_options = useMemo(
    () => roomTypeRaw?.map((val) => ({ label: val, value: val })) ?? [], // Handle null case
    [roomTypeRaw] // Depends only on the fetched raw data state
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
    measurement_type: null,
    name: "",
    price: null,
    room_type: null,
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
          {error ? <Text>Error: {error.message}</Text> : null}
          {isLoading ? (
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
                data={measurement_type_options}
                selectedValue={item.measurement_type}
                placeholder="Select Measurement Type"
                title="Measurement Type"
                onValueChange={(value) => {
                  setItem({
                    ...item,
                    measurement_type: value as Enums<"measurement_type">,
                  });
                }}
              />
              <DropdownInputCustom
                data={room_type_options}
                selectedValue={item.room_type}
                placeholder="Select Room Type"
                title="Room Name"
                onValueChange={(value) => {
                  setItem({ ...item, room_type: value as Enums<"room_type"> });
                }}
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
