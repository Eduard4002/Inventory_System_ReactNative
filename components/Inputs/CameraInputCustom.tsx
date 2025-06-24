// src/components/Inputs/CameraInputCustom.tsx

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useCallback, useRef } from "react";
import {
  Camera,
  CameraCaptureError,
  PhotoFile,
  useCameraDevice,
} from "react-native-vision-camera";

interface CameraOverlayProps {
  isActive: boolean;
  onPictureTaken: (image: PhotoFile) => void;
  onClose: () => void;
  navbarHeight?: number;
}

const CameraInputCustom: React.FC<CameraOverlayProps> = ({
  isActive,
  onPictureTaken,
  onClose,
  navbarHeight = 56,
}) => {
  let camera = null;
  let device = null;
  if (Platform.OS !== "web") {
    device = useCameraDevice("back");
    camera = useRef<Camera>(null);
  }

  const captureImage = useCallback(async () => {
    if (camera?.current == null) return;
    try {
      const photo = await camera.current.takeSnapshot({ quality: 100 });
      onPictureTaken(photo);
    } catch (e) {
      console.error("Failed to take photo:", e);
      if (e instanceof CameraCaptureError) {
        console.error("Capture Error code:", e.code);
      }
      onClose();
    }
  }, [onPictureTaken, onClose]);

  if (!isActive || !device) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.cameraContainer, { bottom: navbarHeight }]}>
      {Platform.OS !== "web" && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          photo={true}
          device={device}
          isActive={true}
          photoQualityBalance="speed"
        />
      )}

      {/* --- Back Button --- */}
      {/* This is the new addition */}
      <TouchableOpacity
        className="absolute top-4 left-4 z-20 w-10 h-10 flex-row items-center justify-center rounded-full bg-black bg-opacity-50 border-2 border-white"
        onPress={onClose} // Just call the onClose prop
      >
        <Text className="color-white text-xl font-medium">X</Text>
      </TouchableOpacity>
      {/* --- End of Back Button --- */}

      <View className="absolute bottom-0 w-full flex-row justify-center p-4">
        <TouchableOpacity
          className="bg-red-500 rounded-full w-20 h-20 items-center justify-center border-4 border-white"
          onPress={captureImage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  // New styles for the back button
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white", // White border for visibility
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CameraInputCustom;
