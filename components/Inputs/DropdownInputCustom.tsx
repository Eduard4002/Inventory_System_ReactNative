import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

interface DropdownInputCustomProps {
  onValueChange: (value: string) => void; // Callback to send the selected value to the parent
  selectedValue: string | null; // <-- Accept the selected value from the parent
  title?: string;
  data: Array<{ label: string; value: string }>; // Make data required or handle empty case
  placeholder?: string; // Optional placeholder
}

const DropdownInputCustom: React.FC<DropdownInputCustomProps> = ({
  onValueChange,
  selectedValue,
  title = "Select Value",
  data,
  placeholder = "Select...", // Default placeholder
}) => {
  return (
    <View className="mt-6 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
      <Text className="text-white text-xl font-bold p-1">{title}:</Text>

      <Dropdown
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.container}
        activeColor="#929292ff"
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={selectedValue}
        onChange={(item) => {
          // Just call the callback passed from the parent
          onValueChange(item.value);
          console.log("Dropdown selected:", item.label);
        }}
        placeholder={placeholder}
        placeholderStyle={styles.itemTextStyle}
        /* renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={"white"}
            name="Safety"
            size={20}
          />
        )} */
      />
    </View>
  );
};

export default DropdownInputCustom;

const styles = StyleSheet.create({
  dropdown: {
    width: 288,
    height: 64,
    padding: 8,
    borderColor: "#ececec",
    borderWidth: 2,

    backgroundColor: "#616161e8",
  },
  container: {
    backgroundColor: "#424242ff",
    color: "white",
    borderColor: "#ececec",
    borderWidth: 2,
  },
  icon: {
    marginRight: 5,
  },
  itemTextStyle: {
    color: "white",
    fontWeight: "bold",

    fontSize: 16,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
