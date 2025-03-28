import { ScrollView, Text, View, Image, FlatList } from "react-native";
import ItemCard from "@/components/ItemCard";
export default function Index() {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <ItemCard title="Brasno" id={0} />
        <ItemCard title="Brasno" id={0} />
        <ItemCard title="Brasno" id={0} />
        <ItemCard title="Brasno" id={0} />
        <ItemCard title="Brasno" id={0} />
        <ItemCard title="Brasno" id={0} />
      </ScrollView>
    </View>
  );
}
