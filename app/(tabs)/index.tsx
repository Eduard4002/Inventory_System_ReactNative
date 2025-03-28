import { ScrollView, Text, View, Image, FlatList } from "react-native";
import ItemCard from "@/components/ItemCard";
export default function Index() {
  //Generate random items objects using the Item interface
  const items: Item[] = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
    measurement_unit: "kg",
    measurement_amount: Math.floor(Math.random() * 10) + 1,
    room_id: Math.floor(Math.random() * 5) + 1,
    price: Math.floor(Math.random() * 100) + 1,
    expiry_date: new Date(Date.now() + Math.floor(Math.random() * 10000000000)),
    amount: Math.floor(Math.random() * 10) + 1,
  }));

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <FlatList
          data={items}
          renderItem={({ item }) => <ItemCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="mt-2 pb-32"
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}
