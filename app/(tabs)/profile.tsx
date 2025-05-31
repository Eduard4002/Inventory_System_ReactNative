import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useCameraPermission,
  Camera,
  useCameraDevice,
  CameraCaptureError,
  useCameraFormat,
  Templates,
  PhotoFile,
} from "react-native-vision-camera";
const windowDimensions = Dimensions.get("window");

const Profile = () => {
  const camera = useRef<Camera>(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<PhotoFile | null>(null);
  const device = useCameraDevice("front");
  // called when the user presses a "capture" button
  const captureImage = useCallback(async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto();
        console.log("Photo captured:", photo);
        setCameraActive(false);
        setCapturedImage(photo);
      } else {
        console.error("Camera reference is null.");
      }
    } catch (e) {
      if (e instanceof CameraCaptureError) {
        switch (e.code) {
          case "capture/file-io-error":
            console.error("Failed to write photo to disk!");
            break;
          default:
            console.error(e);
            break;
        }
      }
    }
  }, [camera]);
  //Get the dimensions of the screen, so the background image can be set to the size of the screen
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  return (
    <View className="">
      <View className="absolute text-text-title w-1/2 flex items-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
        <TouchableOpacity
          className="bg-accent-dark px-6 py-3 rounded-md w-full"
          onPress={() => setCameraActive(true)}
        >
          <Text className="text-white font-bold text-xl text-center">
            OPEN CAMERA
          </Text>
        </TouchableOpacity>
      </View>
      {capturedImage && (
        <Image
          source={{ uri: "file://" + capturedImage.path }}
          style={{
            width: 400,
            height: 400,
          }}
        />
      )}
      {cameraActive && hasPermission && device && (
        <View
          className="flex-col items-center justify-end relative p-6"
          style={{ height: dimensions.window.height - 56 }}
        >
          <Camera
            ref={camera}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: dimensions.window.width,
              // Set the height to fill the screen minus the tab bar height
              height: dimensions.window.height - 56,
            }}
            photo={true}
            device={device}
            isActive={cameraActive}
          />
          <View className="text-text-title w-1/2 flex items-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
            <TouchableOpacity
              className="bg-accent-dark px-6 py-3 rounded-md w-full"
              onPress={captureImage}
            >
              <Text className="text-white font-bold text-xl text-center">
                CAPTURE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
