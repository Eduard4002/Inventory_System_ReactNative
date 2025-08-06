import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import local from "@/assets/localization";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (value: string) => void;
  sortOptions: { label: string; value: string }[];
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  currentSort,
  onSortChange,
  sortOptions,
}) => {
  // Now, this component returns the ModalWrapper with its content inside
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={local.index.sortBy["Sort Items"]}
    >
      <View className="flex-1">
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSortChange(option.value)}
            className="p-2 mt-2 w-full border-2 border-accent-primary rounded-md bg-dark-100"
            style={{
              backgroundColor:
                currentSort === option.value ? "#363636" : "#616161e8",
            }}
          >
            <Text className="text-text-title text-xl font-bold">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ModalWrapper>
  );
};

export default SortModal;
