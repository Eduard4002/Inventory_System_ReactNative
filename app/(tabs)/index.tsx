import {
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ItemCard from "@/components/ItemCard";
import useFetch from "@/services/usefetch";
import { fetchItems } from "@/services/api";
import * as Notifications from "expo-notifications";
import {
  addNotificationListener,
  addNotificationResponseListener,
  requestNotificationPermission,
} from "@/services/notifications";
import { useLocalSearchParams } from "expo-router";

import { enGB, registerTranslation } from "react-native-paper-dates";
import { useCallback, useEffect, useMemo, useState } from "react";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
import { background } from "@/constants/background";
import { Constants, Tables } from "@/database.types";
import supabase from "@/services/supabase";
import SearchBar from "@/components/SearchBar";

import SortModal from "@/components/Modal/SortModal";
import FilterModal from "@/components/Modal/FilterModal";
import { icons } from "@/constants/icons";
import InfoModal from "@/components/Modal/InfoModal";
import {
  useRoute,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AntDesign from "@expo/vector-icons/AntDesign";

import local from "@/assets/localization";
type IndexScreenRouteProp = RouteProp<RootStackParamList, "index">;
type InfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "index"
>;
registerTranslation("en", enGB);

const windowDimensions = Dimensions.get("window");

export default function Index() {
  const { initialFilter } = useLocalSearchParams();

  const [items, setItems] = useState<Tables<"Item">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(true);
  const navigation = useNavigation<InfoScreenNavigationProp>();

  const route = useRoute<IndexScreenRouteProp>();

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
    const readAllChannel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Item",
        },
        (payload) => {
          console.log("Change received!", payload);
          // Add the new item to the beginning of our existing list in the state
          if (payload.eventType === "INSERT") {
            setItems((currentItems) => [
              payload.new as Tables<"Item">,
              ...currentItems,
            ]);
          } else if (payload.eventType === "DELETE") {
            setItems((currentItems) =>
              currentItems.filter(
                (item) => item.id !== (payload.old as Tables<"Item">).id
              )
            );
          } else if (payload.eventType === "UPDATE") {
            setItems((currentItems) =>
              currentItems.map((item) =>
                item.id === (payload.new as Tables<"Item">).id
                  ? (payload.new as Tables<"Item">)
                  : item
              )
            );
          }
        }
      )
      .subscribe();
    /* const insertChannel = supabase
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
    const updateChannel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Item",
        },
        (payload) => {
          console.log("Update received!", payload);
          // Update the item in the state
          setItems((currentItems) =>
            currentItems.map((item) =>
              item.id === (payload.new as Tables<"Item">).id
                ? (payload.new as Tables<"Item">)
                : item
            )
          );
        }
      )
      .subscribe();*/
    return () => {
      //insertChannel.unsubscribe();
      //updateChannel.unsubscribe();
      readAllChannel.unsubscribe();
    };
  }, []);
  const [sortBy, setSortBy] = useState("price_desc");
  const [filterBy, setFilterBy] = useState("all");
  const [roomType, setRoomType] = useState("");
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });
  //Get the dimensions of the screen, so the background image can be set to the size of the screen
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  const sortOptions = [
    { label: local.en.index.sortBy["None"], value: "none" },
    { label: local.en.index.sortBy["Price-ExpToCheap"], value: "price_desc" },
    { label: local.en.index.sortBy["Price-CheapToExp"], value: "price_asc" },
    { label: local.en.index.sortBy["Expiry-NearFirst"], value: "expiry_asc" },
    { label: local.en.index.sortBy["Expiry-FarFirst"], value: "expiry_desc" },
  ];
  const filterOptions = [
    { label: local.en.index.filter["All Items"], value: "all" },
    { label: local.en.index.filter["Expired Items"], value: "expired" },
    { label: local.en.index.filter["Expiring Soon"], value: "expiring_soon" },
    { label: local.en.index.filter["Room Type"], value: "room_type" },
  ];

  const room_type = Constants.public.Enums.room_type.map((value) => ({
    label: value,
    value: value,
  }));
  useFocusEffect(
    useCallback(() => {
      // Check if the special 'initialFilter' parameter was passed
      if (route.params?.initialFilter) {
        console.log("Found initialFilter param:", route.params.initialFilter);
        // Set the filter state to the value from the parameter
        setFilterBy(route.params.initialFilter);

        // IMPORTANT: Clear the parameter so it doesn't get re-applied
        // on the next focus event if the user changes the filter manually.
        navigation.setParams({ initialFilter: undefined });
      }
    }, [route.params?.initialFilter]) // This effect re-runs if the parameter changes
  );
  /* useEffect(() => {
    // Handle notification tap when app is launched from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log(
          "Initial notification response (cold start):",
          response.notification.request.content.data
        );
        if (response.notification.request.content.data?.initialFilter) {
          console.log(
            "Found initialFilter in notification data:",
            response.notification.request.content.data.initialFilter
          );
          // Set the filter state to the value from the notification data
          setFilterBy(response.notification.request.content.data.initialFilter);
        }
      }
    });
  }, []); */
  useEffect(() => {
    if (initialFilter && typeof initialFilter === "string") {
      setFilterBy(initialFilter);
    }
  }, [initialFilter]);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    let result = items;

    if (filterBy === "expired") {
      const currentDate = new Date(Date.now());
      result = result.filter((item) => {
        const expiryDate = item.expiry_date
          ? new Date(item.expiry_date)
          : new Date(0);
        return expiryDate.getTime() < currentDate.getTime(); // Compare dates
      });
    }
    if (filterBy === "expiring_soon") {
      const currentDate = new Date(Date.now());
      const sevenDaysFromNow = new Date();
      // TODO: For now I have defined "soon" to be 7 days, but this can be changed to a user setting
      sevenDaysFromNow.setDate(currentDate.getDate() + 7);
      result = result.filter((item) => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        // Check if the date is in the future but before our 7-day limit
        return expiryDate > currentDate && expiryDate < sevenDaysFromNow;
      });
    }
    // Filter by room type
    if (filterBy === "room_type" && roomType) {
      console.log("Filtering by room type:", roomType);
      result = result.filter((item) => {
        return item.room_type === roomType;
      });
    }
    if (searchQuery) {
      // Make search case-insensitive by converting both to lower case
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter((item) => {
        // Check if the item's name includes the search query
        return item.name?.toLowerCase().includes(lowercasedQuery);
      });
    }
    return result;
  }, [items, filterBy, roomType, searchQuery]);
  const sortedItems = useMemo(() => {
    if (!Array.isArray(filteredItems)) return [];
    switch (sortBy) {
      case "price_desc":
        return [...filteredItems].sort(
          (a, b) => (b.price || 0) - (a.price || 0)
        );
      case "price_asc":
        return [...filteredItems].sort(
          (a, b) => (a.price || 0) - (b.price || 0)
        );

      case "expiry_asc":
        return [...filteredItems].sort(
          (a, b) =>
            new Date(a.expiry_date || 0).getDate() -
            new Date(b.expiry_date || 0).getDate()
        );
      case "expiry_desc":
        return [...filteredItems].sort(
          (a, b) =>
            new Date(b.expiry_date || 0).getDate() -
            new Date(a.expiry_date || 0).getDate()
        );
      default:
        return filteredItems;
    }
  }, [filteredItems, sortBy]);
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
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center pt-8">
            <View className="flex-row  p-2 mx-2  border-2 border-accent-primary rounded-md bg-dark-100 self-stretch items-center justify-center">
              <Text className="text-text-title text-4xl font-bold">
                {local.en.index["Current Items"]}
              </Text>
            </View>
            {itemsLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : null}
            <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />
            <View className="flex-row justify-center mt-2 space-x-4">
              <TouchableOpacity
                onPress={() => setSortModalVisible(true)}
                className="flex-1 p-3 border-2 border-accent-primary rounded-md bg-dark-100 items-center"
                style={{
                  backgroundColor:
                    sortBy === "none" ? "#929292ce" : "#616161e8",
                }}
              >
                <AntDesign
                  name="downcircleo"
                  size={24}
                  color="#FFFFFF"
                  className="w-7 h-7"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
                className="flex-1 p-3 border-2 border-accent-primary rounded-md bg-dark-100 items-center"
                style={{
                  backgroundColor:
                    filterBy === "all" ? "#929292ce" : "#616161e8",
                }}
              >
                <AntDesign
                  name="filter"
                  size={24}
                  color="#FFFFFF"
                  className="w-7 h-7"
                />
              </TouchableOpacity>
            </View>
            <View className="p-2 mt-2 w-full border-2 border-accent-primary rounded-md bg-dark-100">
              <Text className="text-text-title text-2xl font-bold">
                {local.en.index["Total Items"]}: {filteredItems.length}
              </Text>
            </View>
            <FlatList
              data={sortedItems}
              renderItem={({ item }) => <ItemCard {...item} />}
              keyExtractor={(item) =>
                item?.id ? item.id.toString() : Math.random().toString()
              }
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-around",
                marginVertical: 50,
                marginBottom: 10,
              }}
              className="mt-6 pb-32"
              scrollEnabled={false}
            />
          </View>
          {itemsError ? (
            <>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(true)}
                className="p-3 border-2 border-accent-primary rounded-md bg-red-500 items-center"
              >
                <Text className="text-white text-xl">Show Error</Text>
              </TouchableOpacity>
              <InfoModal
                visible={isInfoModalVisible}
                title={"Error"}
                message={itemsError.message}
                onClose={() => setInfoModalVisible(false)}
              />
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
      <SortModal
        visible={isSortModalVisible}
        onClose={() => setSortModalVisible(false)}
        currentSort={sortBy}
        sortOptions={sortOptions}
        onSortChange={(value) => {
          setSortBy(value);
          setSortModalVisible(false);
        }}
      />
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        currentFilter={filterBy}
        filterOptions={filterOptions}
        onFilterChange={(value) => {
          setFilterBy(value);
          if (value !== "room_type") {
            setRoomType(""); // Reset room type when filter is not room_type
            setFilterModalVisible(false); // Close the modal
          }
        }}
        currentRoom={roomType}
        onRoomChange={(value) => {
          setRoomType(value);
          setFilterModalVisible(false); // Close the modal after selecting room type
        }}
      />
    </ImageBackground>
  );
}
