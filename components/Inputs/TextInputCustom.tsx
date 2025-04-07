import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
interface TextInputCustomProps {
  onChangeText: (text: string) => void;
  placeholder?: string;
  title?: string;
  inputMode?:
    | "decimal"
    | "email"
    | "none"
    | "numeric"
    | "search"
    | "tel"
    | "text"
    | "url";
}

const TextInputCustom: React.FC<TextInputCustomProps> = ({
  onChangeText,
  placeholder = "Enter text",
  title = "Title",
  inputMode = "text",
}) => {
  const [value, setValue] = useState("");

  const handleTextChange = (text: string) => {
    setValue(text); // Update local state
    onChangeText(text); // Send the updated value to the parent
  };

  return (
    <View className="mt-6 border-blue-700 border-2 p-2">
      <Text className="text-white text-xl font-bold p-1">{title}:</Text>

      <View className="w-72 h-20 flex-row items-start justify-between p-2  border-2 border-accent rounded-md bg-dark-100">
        <TextInput
          className="text-white font-bold text-xl w-full h-full border-red-400 border-2"
          inputMode={inputMode}
          placeholder={placeholder}
          placeholderTextColor="#A8B5DB"
          value={value} // Bind the value to the state
          onChangeText={handleTextChange} // Trigger the callback on text change
        />
      </View>
    </View>
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({});
