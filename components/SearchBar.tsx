import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { icons } from "@/constants/icons"; // Assuming you have a search icon here
import AntDesign from "@expo/vector-icons/AntDesign";
import local from "@/assets/localization";
interface SearchBarCustomProps {
  onSearchChange: (text: string) => void;
  value: string;
  title?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarCustomProps> = ({
  onSearchChange,
  value,
  title = local.index["Search"],
  placeholder = local.index["Search-By"],
}) => {
  return (
    <View className="mt-6 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
      <Text className="text-text-title text-xl font-bold p-1">{title}:</Text>

      <View
        style={{ width: 288, height: 64 }}
        className="flex-row items-center p-2 border-2 border-accent-primary rounded-md bg-dark-200"
      >
        <AntDesign
          name="search1"
          size={24}
          color="#FFFFFF"
          className="w-7 h-7 "
        />
        <TextInput
          className="text-text-title font-bold text-xl flex-1 h-full"
          placeholder={placeholder}
          placeholderTextColor="#b8b8b8"
          value={value}
          onChangeText={onSearchChange}
        />
        {value ? (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            className="p-1 ml-3"
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
