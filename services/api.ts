import { Tables } from "@/database.types";
import supabase from "./supabase";
// This function fetches items from the database. If ID is -1, it fetches all items. Otherwise, it fetches the item with the given ID.
export const fetchItems = async ({ ID }: { ID: number }) => {
  //If ID is not -1, fetch item with that ID
  if (ID != -1) {
    const { data, error } = await supabase
      .from("Item")
      .select("*")
      .eq("id", ID)
      .single();
    console.log("data", data);

    if (error) {
      console.error("Error fetching item:", error.message);
      throw new Error(error.message);
    }
    return data;
  } else {
    const { data, error } = await supabase.from("Item").select("*");
    console.log("data", data);
    if (error) {
      console.error("Error fetching items:", error.message);
      throw new Error(error.message);
    }

    return data;
  }
};
export const fetchEnum = async (Name: string) => {
  const { data, error } = await supabase.rpc("get_types", {
    enum_type: Name,
  });
  if (error) {
    console.error("Error fetching enum:", error.message);
    throw new Error(error.message);
  }
  console.log("Fetching an enum: ", Name, "data: ", data);
  return data;
};
export const insertItem = async (item: Tables<"Item">) => {
  const { data, error } = await supabase.from("Item").insert([item]).select();
  if (error) {
    console.error("Error inserting a item:", error.message);
    throw new Error(error.message);
  }

  return data;
};
//Updates the amount of an item in the database
export const updateAmount = async (ID: number, amount: number) => {
  const { data, error } = await supabase
    .from("Item")
    .update({ amount })
    .eq("id", ID)
    .select("*");

  if (error) {
    console.error("Error updating item amount:", error.message);
    throw new Error(error.message);
  }
  console.log("Updated data: ", data);

  return data;
};
