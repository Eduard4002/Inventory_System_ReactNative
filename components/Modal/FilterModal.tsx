import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import DropdownInputCustom from "../Inputs/DropdownInputCustom";
import { Constants } from "@/database.types";
import ModalWrapper from "./ModalWrapper"; // Import the wrapper

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  currentFilter: string;
  onFilterChange: (value: string) => void;
  filterOptions: { label: string; value: string }[];
  currentRoom: string;
  onRoomChange: (value: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  currentFilter,
  onFilterChange,
  filterOptions,
  currentRoom,
  onRoomChange,
}) => {
  const roomOptions = Constants.public.Enums.room_type.map((val) => ({
    label: val,
    value: val,
  }));

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Filter Items">
      <View>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onFilterChange(option.value)}
            className="p-2 mt-2 w-full border-2 border-accent-primary rounded-md bg-dark-100"
            style={{
              backgroundColor:
                currentFilter === option.value ? "#363636" : "#616161e8",
            }}
          >
            <Text className="text-text-title text-xl font-bold">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
        {currentFilter === "room_type" && (
          <View className="flex-column items-end">
            {roomOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onRoomChange(option.value)}
                className="p-2 mt-2  w-4/5 border-2 border-accent-primary rounded-md bg-dark-100"
                style={{
                  backgroundColor:
                    currentRoom === option.value ? "#363636" : "#616161e8",
                }}
              >
                <Text className="text-text-title text-xl font-bold">
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* <DropdownInputCustom
          title="Filter By"
          selectedValue={currentFilter}
          data={filterOptions}
          onValueChange={onFilterChange}
        />
        {currentFilter === "room_type" && (
          <DropdownInputCustom
            title="Select Room"
            selectedValue={currentRoom}
            data={roomOptions}
            onValueChange={onRoomChange}
          />
        )} */}
      </View>
    </ModalWrapper>
  );
};

export default FilterModal;
