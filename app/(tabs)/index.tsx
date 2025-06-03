import {
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import ItemCard from "@/components/ItemCard";
import useFetch from "@/services/usefetch";
import { fetchItems } from "@/services/api";

import { enGB, registerTranslation } from "react-native-paper-dates";
import { useEffect, useMemo, useState } from "react";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
import { background } from "@/constants/background";
import { BlurView } from "expo-blur";
import { Constants, Tables } from "@/database.types";
import supabase from "@/services/supabase";
import SearchBar from "@/components/SearchBar";
registerTranslation("en", enGB);

const windowDimensions = Dimensions.get("window");

export default function Index() {
  const [items, setItems] = useState<Tables<"Item">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    { label: "Price: Expensive to Cheapest", value: "price_desc" },
    { label: "Price: Cheapest to Expensive", value: "price_asc" },
    { label: "Expiry Date: Nearest First", value: "expiry_asc" },
    { label: "Expiry Date: Farthest First", value: "expiry_desc" },
  ];
  const filterOptions = [
    { label: "All Items", value: "all" },
    { label: "Expired Items", value: "expired" },
    { label: "Room Type", value: "room_type" }, // Add Room Type filter option
  ];

  const room_type = Constants.public.Enums.room_type.map((value) => ({
    label: value,
    value: value,
  }));

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
      <View className="flex-1 pt-8">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <View className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 self-center">
            <View className="flex-row  p-2 mx-2  border-2 border-accent-primary rounded-md bg-dark-100 self-stretch items-center justify-center">
              <Text className="text-text-title text-4xl font-bold">
                Current Items
              </Text>
            </View>
            {itemsLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : itemsError ? (
              <Text className="text-red-600">Error: {itemsError?.message}</Text>
            ) : null}
            <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />
            <DropdownInputCustom
              title="Sort By"
              selectedValue={sortBy}
              placeholder="Select Sort Option"
              data={sortOptions}
              onValueChange={(value) => setSortBy(value)}
            />
            <DropdownInputCustom
              title="Filter By"
              selectedValue={filterBy}
              placeholder="Select Filter Option"
              data={filterOptions}
              onValueChange={(value) => setFilterBy(value)}
            />
            {filterBy === "room_type" && (
              <DropdownInputCustom
                title="Select Room Type"
                data={room_type || []}
                selectedValue={roomType}
                placeholder="Select Room Type"
                onValueChange={(value) => setRoomType(value)}
              />
            )}
            <View className="p-2 mt-2 w-2/3 border-2 border-accent-primary rounded-md bg-dark-100">
              <Text className="text-text-title text-2xl font-bold">
                Total Items: {filteredItems.length}
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
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
