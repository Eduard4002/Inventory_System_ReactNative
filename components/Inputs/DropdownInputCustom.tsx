import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

interface DropdownInputCustomProps {
  onValueChange: (value: string) => void; // Callback to send the selected value to the parent
  title?: string; // Title to display above the input
  data?: Array<{ label: string; value: string }>; // Optional data prop to pass custom data
}
const defaultData = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
];
const DropdownInputCustom: React.FC<DropdownInputCustomProps> = ({
  onValueChange,
  title = "Select Value",
  data = defaultData,
}) => {
  const [value, setValue] = useState(data[0].value); // Default value set to the first item in the data array
  const [isFocus, setIsFocus] = useState(false);

  React.useEffect(() => {
    if (data.length > 0) {
      setValue(data[0].value); // Set default value to the first item in the data array
      onValueChange(data[0].value);
      console.log("Data changed:", data[0].value);
    }
  }, [data]);

  return (
    <View className="mt-6 border-blue-700 border-2 p-2">
      <Text className="text-white text-xl font-bold p-1">{title}:</Text>

      <Dropdown
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.container}
        activeColor="#AB8BFF"
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          onValueChange(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={"white"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownInputCustom;

const styles = StyleSheet.create({
  dropdown: {
    width: 250,
    height: 80,
    padding: 8,
    borderColor: "#AB8BFF",
    borderWidth: 2,

    backgroundColor: "#221F3D",
  },
  container: {
    backgroundColor: "#221F3D",
    color: "white",
    borderColor: "#AB8BFF",
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
