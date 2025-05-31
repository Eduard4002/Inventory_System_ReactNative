import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { icons } from "@/constants/icons";
import React, { useState, useCallback } from "react"; // useCallback is still useful
import { DatePickerModal } from "react-native-paper-dates";

interface DateInputCustomProps {
  onDateChange: (date: Date) => void;
  value: Date | string | null; // <-- The controlled value from the parent
  title?: string;
}

const DateInputCustom: React.FC<DateInputCustomProps> = ({
  onDateChange,
  value, // <-- Receive the value prop on every render
  title = "Select Date",
}) => {
  // This function reliably converts the parent's value into a valid Date object.
  const parseValueToDate = (v: Date | string | null): Date => {
    // If value is a valid Date object already, just return it.
    if (v instanceof Date && !isNaN(v.getTime())) {
      return v;
    }

    // If value is a string, we manually parse it.
    if (typeof v === "string") {
      // This splits the string "DD/MM/YYYY" into parts.
      const parts = v.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS (Jan=0)
        const year = parseInt(parts[2], 10);
        const newDate = new Date(year, month, day);

        // Check if the constructed date is valid
        if (!isNaN(newDate.getTime())) {
          return newDate;
        }
      }
    }

    // Fallback for null, undefined, or invalid formats
    return new Date();
  };

  // Use the custom parser
  const currentDate = parseValueToDate(value);

  // The 'open' state is fine to keep, as it's purely for UI presentation
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // The handler now only needs to inform the parent.
  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpen(false);
      // REMOVED: setDate(params.date);
      onDateChange(params.date); // Just send the new date up to the parent
    },
    [setOpen, onDateChange]
  );

  return (
    <View className="mt-6 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
      <Text className="text-white text-xl font-bold p-1">{title}:</Text>
      <View
        style={{ width: 288, height: 64 }}
        className="flex-row items-center justify-between p-2 border-2 border-accent-primary rounded-md bg-dark-200"
      >
        <TextInput
          className="text-white font-bold text-xl w-2/3"
          // The displayed value is now based on the prop from the parent
          value={currentDate.toLocaleDateString()}
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
        // The modal's date is also controlled by the parent's prop
        date={currentDate}
        onConfirm={onConfirmSingle}
        saveLabel="Save"
        validRange={{
          startDate: new Date(2000, 0, 1), // It's better not to limit start date to today
          endDate: new Date(2199, 0, 1),
        }}
      />
    </View>
  );
};

export default DateInputCustom;

const styles = StyleSheet.create({});
