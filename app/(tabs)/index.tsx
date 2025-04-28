import {
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ItemCard from "@/components/ItemCard";
import useFetch from "@/services/usefetch";
import { fetchItems, fetchEnum } from "@/services/api";

import { enGB, registerTranslation } from "react-native-paper-dates";
import { useMemo, useState } from "react";
import DropdownInputCustom from "@/components/Inputs/DropdownInputCustom";
registerTranslation("en", enGB);

export default function Index() {
  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
  } = useFetch(() => fetchItems({ ID: -1 }));
  const [sortBy, setSortBy] = useState("price_desc");
  const [filterBy, setFilterBy] = useState("all");
  const [roomType, setRoomType] = useState("");

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
  const {
    data: room_type_raw,
    loading: roomLoading,
    error: roomError,
  } = useFetch(() => fetchEnum("room_type"));
  const room_type = useMemo(
    () =>
      (room_type_raw as string[] | undefined)?.map((item) => ({
        label: item,
        value: item,
      })),
    [room_type_raw]
  );

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
    return result;
  }, [items, filterBy, roomType]);
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
    <View className="flex-1 bg-primary pt-8">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <View className="flex-row  p-2 mx-2  border-2 border-accent rounded-md bg-dark-100 self-stretch items-center justify-center">
          <Text className="text-white text-4xl font-bold">Current Items</Text>
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
        <Text className="text-white text-lg font-bold mt-2">
          Total Items: {filteredItems.length}
        </Text>
        <FlatList
          data={sortedItems}
          renderItem={({ item }) => <ItemCard {...item} />}
          keyExtractor={(item) =>
            item?.id ? item.id.toString() : Math.random().toString()
          }
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="mt-6 pb-32"
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}
