import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
interface TextInputCustomProps {
  onChangeText: (text: string) => void;
  placeholder?: string;
  value: string | null;
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
  value,
  placeholder = "Enter text",
  title = "Title",
  inputMode = "text",
}) => {
  return (
    <View className="mt-6 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
      <Text className="text-text-title text-xl font-bold p-1">{title}:</Text>

      <View
        style={{ width: 288, height: 64 }}
        className="flex-row items-center justify-center px-2 border-2 border-accent-primary rounded-md bg-dark-200"
      >
        <TextInput
          className="text-text-title font-bold text-xl absolute w-full h-full p-2"
          inputMode={inputMode}
          placeholder={placeholder}
          placeholderTextColor="#b8b8b8"
          value={value ?? " "} // Bind the value to the state
          onChangeText={onChangeText} // Trigger the callback on text change
        />
      </View>
    </View>
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({});
