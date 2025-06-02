import { Tables } from "@/database.types";
import supabase from "./supabase";
import { PhotoFile } from "react-native-vision-camera";


// This function fetches items from the database. If ID is -1, it fetches all items. Otherwise, it fetches the item with the given ID.
export const fetchItems = async ({ ID }: { ID: number }) => {
  //If ID is not -1, fetch item with that ID
  if (ID != -1) {
    const { data, error } = await supabase
      .from("Item")
      .select("*")
      .eq("id", ID)
      .single();

    if (error) {
      console.error("Error fetching item:", error.message);
      throw new Error(error.message);
    }
    return data;
  } else {
    const { data, error } = await supabase.from("Item").select("*");
    if (error) {
      console.error("Error fetching items:", error.message);
      throw new Error(error.message);
    }

    return data;
  }
};

export const insertItem = async (item: Tables<"Item">) => {
  const { data, error } = await supabase.from("Item").insert([item]).select();
  if (error) {
    console.error("Error inserting a item:", error.message);
    throw new Error(error.message);
  }

  return data;
};
export const insertImage = async (image : PhotoFile) => {
  const filename = image.path.split("/").pop();
  console.log("Uploading image with filename:", filename);

  const formData = new FormData();
  const photoDetails = {
    uri: `file://${image.path}`,
    type: 'image/jpeg', // The mime type of the file
    name: `photo-${filename}`, // The name of the file
  };
  formData.append('file', photoDetails as any);

  const { data : imageData, error } = await supabase.storage
    .from("item-image")
    .upload(`public/${filename}`, formData);
    

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(error.message);
  }
  console.log("Image uploaded successfully:", imageData);
  const { data } = supabase.storage
      .from('item-image')
      .getPublicUrl(imageData.path);
  return data;
}
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
