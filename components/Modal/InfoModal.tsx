import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModalWrapper from "./ModalWrapper"; // The reusable shell we built earlier

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonText = "OK", // Default button text is "OK"
}) => {
  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title}>
      <View className="flex-1 flex-col items-center justify-around p-4">
        <Text className="text-text-title text-xl my-4">{message}</Text>

        <View className="h-16 mt-4 flex w-full flex-row justify-center">
          <TouchableOpacity
            className="bg-dark-200 border-2 border-accent-primary flex-1 justify-center rounded-md items-center"
            onPress={onClose}
          >
            <Text className="text-white font-bold text-xl">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default InfoModal;
