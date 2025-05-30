import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { icons } from "@/constants/icons";

import React, { useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";

interface DateInputCustomProps {
  onDateChange: (date: Date) => void; // Callback to send the selected date to the parent
  title?: string; // Title to display above the input
}

const DateInputCustom: React.FC<DateInputCustomProps> = ({
  onDateChange,
  title = "Select Date",
}) => {
  const [date, setDate] = useState(new Date(Date.now()));
  const [open, setOpen] = useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpen(false);
      setDate(params.date);
      onDateChange(params.date); // Send the selected date to the parent
    },
    [setOpen, setDate, onDateChange]
  );
  return (
    <View className="mt-6 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
      <Text className="text-white text-xl font-bold p-1">{title}:</Text>

      <View
        style={{ width: 288, height: 64 }}
        className="flex-row items-center justify-between p-2  border-2 border-accent-primary rounded-md bg-dark-200"
      >
        <TextInput
          className="text-white font-bold text-xl w-2/3 "
          inputMode="text"
          value={date.toLocaleDateString()}
          placeholderTextColor="#A8B5DB"
          editable={false}
        />
        <TouchableOpacity
          onPress={() => setOpen(true)}
          className="bg-dark-100 p-2 rounded-md"
        >
          <Image source={icons.star} />
        </TouchableOpacity>
      </View>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
        saveLabel="Save"
        validRange={{
          startDate: new Date(Date.now()),
          endDate: new Date(new Date().setFullYear(2199, 1, 1)),
        }}
      />
    </View>
  );
};

export default DateInputCustom;

const styles = StyleSheet.create({});
