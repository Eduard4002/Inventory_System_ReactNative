import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { background } from "@/constants/background";
import { Tables } from "@/database.types";
import supabase from "@/services/supabase";
import useFetch from "@/services/usefetch";
import { fetchItems } from "@/services/api";
import { useNavigation } from "@react-navigation/native"; // <-- ADD THIS IMPORT
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { PieChart } from "react-native-chart-kit";
import local from "@/assets/localization";
type InfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Info"
>;

const _renderItem = ({ item }: { item: { label: string; value: string } }) => (
  <View
    style={{ width: "100%" }}
    className="flex-row items-center mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100 overflow-auto"
  >
    <Text className="text-text-title font-bold text-l">{item.label}: </Text>
    <Text className="text-text-title text-l">{item.value}</Text>
  </View>
);
const windowDimensions = Dimensions.get("window");

const Info = () => {
  const [items, setItems] = useState<Tables<"Item">[]>([]);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });
  const navigation = useNavigation<InfoScreenNavigationProp>();

  //Get the dimensions of the screen, so the background image can be set to the size of the screen
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });
  // Listen to the changes in the items table so that the items are updated in real-time
  const {
    data,
    loading: itemsLoading,
    error: itemsError,
  } = useFetch(() =>
    fetchItems({ ID: -1 }).then((data) => {
      setItems(data as Tables<"Item">[]);
    })
  );
  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Item",
        },
        (payload) => {
          console.log("Change received!", payload);
          // Add the new item to the beginning of our existing list in the state
          setItems((currentItems) => [
            payload.new as Tables<"Item">,
            ...currentItems,
          ]);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
  const stats = useMemo(() => {
    // Return default values if items haven't loaded yet
    if (!items || items.length === 0) {
      return {
        totalValue: 0,
        uniqueItems: 0,
        expiringSoon: 0,
        expired: 0,
      };
    }

    const now = new Date();
    const sevenDaysFromNow = new Date();
    // TODO: For now I have defined "soon" to be 7 days, but this can be changed to a user setting
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const totalValue = items.reduce((sum, item) => {
      const price = item.price || 0;
      const amount = item.amount || 1; // Assume amount is at least 1 if not specified
      return sum + price * amount;
    }, 0);

    const uniqueItems = items.length;

    const expiredItems = items.filter((item) => {
      if (!item.expiry_date) return false;
      return new Date(item.expiry_date) < now;
    });
    const expiredValue = expiredItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.amount || 1),
      0
    );

    const expiringSoon = items.filter((item) => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      // Check if the date is in the future but before our 7-day limit
      return expiryDate > now && expiryDate < sevenDaysFromNow;
    });
    const expiredSoonValue = expiringSoon.reduce(
      (sum, item) => sum + (item.price || 0) * (item.amount || 1),
      0
    );

    return {
      totalValue,
      uniqueItems,
      expiringSoon: expiringSoon.length,
      expired: expiredItems.length,
      expiredValue,
      expiredSoonValue,
    };
  }, [items]);
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const InventoryInformation = [
    {
      label: local.en.info["Total Value"],
      value: `${stats.totalValue.toFixed(2)} kr`,
    },
    {
      label: local.en.info["Unique Items"],
      value: `${stats.uniqueItems}`,
    },
    {
      label: local.en.info["Expiring Soon"],
      value: `${stats.expiringSoon}`,
    },
    {
      label: local.en.info["Expired Items"],
      value: `${stats.expired}`,
    },
  ];

  return (
    <ImageBackground
      source={background.bg5}
      resizeMode="cover"
      style={{
        flex: 1,
        width: dimensions.window.width,
        height: dimensions.window.height,
      }}
      blurRadius={2}
    >
      <View className="flex-1 pt-8">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center">
            <View className="flex-row  p-2 mx-2  border-2 border-accent-primary rounded-md bg-dark-100 self-stretch items-center justify-center">
              <Text className="text-text-title text-4xl font-bold">
                {local.en.info["Inventory Statistics"]}
              </Text>
            </View>
            <View className="flex-col items-start justify-center mt-5 px-4 ">
              <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                {local.en.info["Key Summary"]}
              </Text>
              <FlatList
                style={{ width: "100%" }}
                data={InventoryInformation}
                numColumns={1}
                renderItem={_renderItem}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{
                  paddingVertical: 8,
                  gap: 0,
                }}
                scrollEnabled={false}
              />
              {(stats.expired > 0 || stats.expiringSoon > 0) && ( // Only show this section if there are expired or expiring soon items
                <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                  {local.en.info["Expiration Warning"]}
                </Text>
              )}

              {stats.expired > 0 && ( // Only show this section if there are expired items}
                <View
                  style={{ width: "100%" }}
                  className="flex-row items-center justify-between mt-2 p-3 border-2 border-accent-primary rounded-md bg-dark-100 overflow-auto"
                >
                  <Text className="text-text-title font-bold text-base w-3/5">
                    {local.en.info["Expired Notice"].replace(
                      "{{value}}",
                      stats.expiredValue?.toFixed(2).toString() ?? ""
                    )}
                  </Text>
                  <TouchableOpacity
                    className="bg-accent-dark px-6 py-3 rounded-md"
                    onPress={() =>
                      navigation.navigate("index", {
                        initialFilter: "expired",
                      })
                    }
                  >
                    <Text className="text-white font-bold text-xl text-center">
                      {local.en.info["View"].toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {stats.expiringSoon > 0 && ( // Only show this section if there are expiring soon items
                <View
                  style={{ width: "100%" }}
                  className="flex-row items-center justify-between mt-2 p-3 border-2 border-accent-primary rounded-md bg-dark-100 overflow-auto"
                >
                  <Text className="text-text-title font-bold text-base w-3/5">
                    {local.en.info["Expiring Soon Notice"].replace(
                      "{{value}}",
                      stats.expiringSoon?.toFixed(2).toString() ?? ""
                    )}
                  </Text>
                  <TouchableOpacity
                    className="bg-accent-dark px-6 py-3 rounded-md"
                    onPress={() =>
                      navigation.navigate("index", {
                        initialFilter: "expiring_soon",
                      })
                    }
                  >
                    <Text className="text-white font-bold text-xl text-center">
                      {local.en.info["View"].toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* <Text className="text-text-title w-full text-center font-bold text-2xl mt-2 p-2 border-2 border-accent-primary rounded-md bg-dark-100">
                Category Breakdown
              </Text> */}
              {/* <PieChart
                data={cityData}
                width={Dimensions.get("window").width - 30}
                height={220}
                accessor={"population"}
                paddingLeft={"15"}
                center={[10, 50]}
                absolute
                chartConfig={chartConfig}
                backgroundColor="transparent"
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Info;

const styles = StyleSheet.create({});
