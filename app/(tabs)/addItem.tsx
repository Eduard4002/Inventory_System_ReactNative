import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";

import React, { useCallback, useEffect, useState } from "react";
import TextInputCustom from "@/components/Inputs/TextInputCustom";
import DateInputCustom from "@/components/Inputs/DateInputCustom";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";

import { insertImage, insertItem } from "@/services/api";
import { Tables, Enums, Constants } from "@/database.types";
import { background } from "@/constants/background";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import InfoModal from "@/components/Modal/InfoModal";
import supabase from "@/services/supabase";
import local from "@/assets/localization";

// Conditional imports for non-web platforms
let CameraInputCustom: any = null;

// Type definition for PhotoFile (matching react-native-vision-camera)
type PhotoFile = {
  path: string;
  width: number;
  height: number;
  isRawPhoto?: boolean;
  orientation?: string;
  isMirrored?: boolean;
};

if (Platform.OS !== "web") {
  CameraInputCustom = require("@/components/Inputs/CameraInputCustom").default;
}
const windowDimensions = Dimensions.get("window");

const getInitialItemState = (): Tables<"Item"> => ({
  amount: 1,
  created_at: new Date().toISOString(),
  expiry_date: new Date().toISOString(),
  measurement_amount: null,
  measurement_type: null,
  name: "",
  price: null,
  room_type: null,
  image_url: null,
});

const AddItem = () => {
  const [item, setItem] = useState<Tables<"Item">>(getInitialItemState());
  const [infoModal, setInfoModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

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

  const handleSave = async () => {
    if (!item.name || !item.amount || !item.measurement_amount) {
      console.log(
        "Validation failed: Name, Amount, and Measurement Amount are required."
      );
      setInfoModal({
        visible: true,
        title: "Missing Information",
        message: local.additem["Missing Information"],
      });
      //TODO: "Not sure if I want to keep the alert on or not, but I will keep it for now"
      return;
    }

    try {
      const data = await insertImage(capturedImage as PhotoFile);
      item.image_url = data.publicUrl; // Set the image URL in the item object
      await insertItem(item as Tables<"Item">);
      setInfoModal({
        visible: true,
        title: "Success!",
        message: local.additem["Success-Save-Item"],
      });
    } catch (error: any) {
      console.error("Error inserting item: ", error);
      setInfoModal({
        visible: true,
        title: "Save Error",

        message:
          local.additem["Failed-Save-Item"] + `\n\nError: ${error.message}`,
      });
      // If we failed to save the item, but the image was saved successfully, we should delete the image
      if (item.image_url != null) {
        const filename = item.image_url.split("/").pop();
        if (filename) {
          /* const { error: deleteError } = await supabase.storage.from("images").delete(filename);
          if (deleteError) {
            console.error("Error deleting image after failed item save:", deleteError);
          } */
        }
      }
    }
  };
  const handlePictureTaken = async (photo: PhotoFile) => {
    console.log("Photo captured in parent:", photo);
    setCapturedImage(photo);
    setCameraActive(false); // Close camera after capture
  };
  useFocusEffect(
    useCallback(() => {
      setItem(getInitialItemState()); // Reset the form data
      setCapturedImage(null); // Reset the captured image

      return () => {
        console.log("AddItem screen unfocused.");
      };
    }, [])
  );

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
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-5 "
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center items-center  pt-8">
              <View className="flex-row  p-2 mx-2  border-2 border-accent-primary rounded-md bg-dark-100 self-stretch items-center justify-center">
                <Text className="text-white text-4xl font-bold">
                  {local.additem["Add Item"]}
                </Text>
              </View>

              <>
                {Platform.OS !== "web" && (
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
                )}
                <TextInputCustom
                  onChangeText={(text) => setItem({ ...item, name: text })}
                  placeholder="Brasno"
                  title={local.additem["Name"]}
                  value={item.name}
                />
                <TextInputCustom
                  onChangeText={(text) =>
                    setItem({ ...item, price: parseFloat(text) })
                  }
                  placeholder="19"
                  title={local.additem["Price"]}
                  inputMode="decimal"
                  value={item.price ? item.price.toString() : ""}
                />
                <TextInputCustom
                  onChangeText={(text) =>
                    setItem({ ...item, measurement_amount: parseFloat(text) })
                  }
                  placeholder="5"
                  title={local.additem["Measurement Amount"]}
                  inputMode="decimal"
                  value={
                    item.measurement_amount
                      ? item.measurement_amount.toString()
                      : ""
                  }
                />
                <DropdownInputCustom
                  data={Constants.public.Enums.measurement_type.map((val) => ({
                    label: val,
                    value: val,
                  }))}
                  selectedValue={item.measurement_type}
                  placeholder={
                    local.additem["Select "] + local.additem["Measurement Type"]
                  }
                  title={local.additem["Measurement Type"]}
                  onValueChange={(value) => {
                    setItem({
                      ...item,
                      measurement_type: value as Enums<"measurement_type">,
                    });
                  }}
                />
                <DropdownInputCustom
                  data={Constants.public.Enums.room_type.map((val) => ({
                    label: val,
                    value: val,
                  }))}
                  selectedValue={item.room_type}
                  placeholder={
                    local.additem["Select "] + local.additem["Room Type"]
                  }
                  title={local.additem["Room Name"]}
                  onValueChange={(value) => {
                    setItem({
                      ...item,
                      room_type: value as Enums<"room_type">,
                    });
                  }}
                />

                <DateInputCustom
                  onDateChange={(date) => {
                    const dateString = date.toISOString();
                    console.log(
                      "Parent: Setting expiry_date to string:",
                      dateString
                    ); // <-- ADD THIS
                    setItem({
                      ...item,
                      expiry_date: dateString,
                    });
                  }}
                  title={local.additem["Expiry Date"]}
                  value={item.expiry_date ? item.expiry_date : new Date()}
                />
                <TextInputCustom
                  onChangeText={(text) =>
                    setItem({ ...item, amount: parseFloat(text) })
                  }
                  placeholder="5"
                  title={local.additem["Amount of Items"]}
                  inputMode="decimal"
                  value={item.amount ? item.amount.toString() : ""}
                />
                <View style={{ width: 288 }} className="h-16 mt-4 flex ">
                  <TouchableOpacity
                    className="bg-dark-200 border-2 border-accent-primary flex-1 justify-center rounded-md items-center"
                    onPress={handleSave}
                  >
                    <Text className="text-white font-bold text-3xl ">
                      {local.additem["Save"].toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
      <InfoModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        onClose={() => setInfoModal({ ...infoModal, visible: false })}
      />
      {Platform.OS !== "web" && (
        <CameraInputCustom
          isActive={cameraActive}
          onPictureTaken={handlePictureTaken}
          onClose={() => setCameraActive(false)}
          navbarHeight={56} // Pass your navbar height here
        />
      )}
    </>
  );
};

export default AddItem;
