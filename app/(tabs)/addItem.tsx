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
  ImageBackground,
  Dimensions,
} from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { icons } from "@/constants/icons";
import TextInputCustom from "@/components/Inputs/TextInputCustom";
import DateInputCustom from "@/components/Inputs/DateInputCustom";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
import CameraInputCustom from "@/components/Inputs/CameraInputCustom";
import useFetch from "@/services/usefetch";
import { fetchEnum, fetchItems, insertItem } from "@/services/api";
import { Tables, Enums } from "@/database.types";
import { background } from "@/constants/background";
import { PhotoFile } from "react-native-vision-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

const windowDimensions = Dimensions.get("window");

const getInitialItemState = (): Tables<"Item"> => ({
  amount: 1,
  created_at: new Date().toLocaleDateString(),
  expiry_date: new Date().toLocaleDateString(),
  measurement_amount: null,
  measurement_type: null,
  name: "",
  price: null,
  room_type: null,
});

const AddItem = () => {
  const [item, setItem] = useState<Tables<"Item">>(getInitialItemState());

  const [measurementTypeRaw, setMeasurementTypeRaw] = useState<string[] | null>(
    null
  );
  const [roomTypeRaw, setRoomTypeRaw] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Combined loading state
  const [error, setError] = useState<Error | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<PhotoFile | null>(null);

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
  const handlePictureTaken = (photo: PhotoFile) => {
    console.log("Photo captured in parent:", photo);
    setCapturedImage(photo);
    setCameraActive(false); // Close camera after capture
  };
  useFocusEffect(
    useCallback(() => {
      // This function will run every time the screen comes into focus

      console.log("AddItem screen focused. Resetting all form state.");

      setItem(getInitialItemState()); // Reset the form data
      setCapturedImage(null); // Reset the captured image

      // You can return a cleanup function that runs when the screen goes out of focus
      return () => {
        console.log("AddItem screen unfocused.");
      };
    }, []) // The empty dependency array [] is important!
  );
  console.log("refreshing...");

  return (
    <>
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
        <View className="flex-1 pt-8">
          <ScrollView
            className="flex-1 px-5 "
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center items-center">
              <View className="flex-row  p-2 mx-2  border-4 border-accent-primary rounded-md bg-dark-100 self-stretch items-center justify-center">
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
                  <TouchableOpacity
                    className="bg-dark-100 p-2 rounded-lg items-center justify-center border-2  border-accent-primary  w-full mt-6"
                    onPress={() => setCameraActive(true)}
                    style={{ height: dimensions.window.height * 0.4 }}
                  >
                    {capturedImage ? (
                      <Image
                        source={{ uri: "file://" + capturedImage.path }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        resizeMode="cover"
                        className="rounded-lg"
                      />
                    ) : (
                      <AntDesign name="camera" size={96} color="white" />
                    )}
                  </TouchableOpacity>
                  <TextInputCustom
                    onChangeText={(text) => setItem({ ...item, name: text })}
                    placeholder="Brasno"
                    title="Name"
                    value={item.name}
                  />
                  <TextInputCustom
                    onChangeText={(text) =>
                      setItem({ ...item, price: parseFloat(text) })
                    }
                    placeholder="19"
                    title="Price"
                    inputMode="decimal"
                    value={item.price ? item.price.toString() : ""}
                  />
                  <TextInputCustom
                    onChangeText={(text) =>
                      setItem({ ...item, measurement_amount: parseFloat(text) })
                    }
                    placeholder="5"
                    title="Measurement Amount"
                    inputMode="decimal"
                    value={
                      item.measurement_amount
                        ? item.measurement_amount.toString()
                        : ""
                    }
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
                      setItem({
                        ...item,
                        room_type: value as Enums<"room_type">,
                      });
                    }}
                  />

                  <DateInputCustom
                    onDateChange={(date) => {
                      const dateString = date.toLocaleDateString();
                      console.log(
                        "Parent: Setting expiry_date to string:",
                        dateString
                      ); // <-- ADD THIS
                      setItem({
                        ...item,
                        expiry_date: dateString,
                      });
                    }}
                    title="Expiry Date"
                    value={item.expiry_date ? item.expiry_date : new Date()}
                  />
                  <TextInputCustom
                    onChangeText={(text) =>
                      setItem({ ...item, amount: parseFloat(text) })
                    }
                    placeholder="5"
                    title="Amount of Items"
                    inputMode="decimal"
                    value={item.amount ? item.amount.toString() : ""}
                  />
                  <View
                    style={{ width: 288 }}
                    className="h-16 mt-4 flex border-2 border-accent-primary"
                  >
                    <TouchableOpacity
                      className="bg-dark-200 flex-1 justify-center  rounded-md items-center"
                      onPress={handleSave}
                    >
                      <Text className="text-white font-bold text-3xl ">
                        SAVE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
      <CameraInputCustom
        isActive={cameraActive}
        onPictureTaken={handlePictureTaken}
        onClose={() => setCameraActive(false)}
        navbarHeight={56} // Pass your navbar height here
      />
    </>
  );
};

export default AddItem;

const styles = StyleSheet.create({});
