import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable, // Use Pressable to prevent taps inside the modal from closing it
  Image,
} from "react-native";
import { icons } from "@/constants/icons"; // Assuming you have a close icon
import AntDesign from "@expo/vector-icons/AntDesign"; // Import AntDesign for the close icon
interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose} // Close modal when background is tapped
      >
        <Pressable
          className="w-11/12 max-w-sm p-4 border-2 border-accent-primary rounded-md bg-dark-100"
          style={{ width: "100%", height: "50%" }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-text-title text-2xl font-bold">{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-1 absolute right-0 top-0"
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {children}
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default ModalWrapper;
