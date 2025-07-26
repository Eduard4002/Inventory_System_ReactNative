import { Tables } from "@/database.types";
import supabase from "./supabase";

// Type definition for PhotoFile (to avoid importing on web)
type PhotoFileType = {
  path: string;
  width: number;
  height: number;
  isRawPhoto?: boolean;
  orientation?: string;
  isMirrored?: boolean;
};

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
    return data as Tables<"Item">;
  } else {
    const { data, error } = await supabase.from("Item").select("*");
    if (error) {
      console.error("Error fetching items:", error.message);
      throw new Error(error.message);
    }

    return data as Tables<"Item">[];
  }
};

export const insertItem = async (item: Tables<"Item">) => {
  console.log("Inserting item:", item);
  const { data, error } = await supabase.from("Item").insert([item]).select();
  if (error) {
    console.error("Error inserting a item:", error.message);
    throw new Error(error.message);
  }

  return data;
};
export const insertImage = async (image: PhotoFileType) => {
  const filename = image.path.split("/").pop();
  console.log("Uploading image with filename:", filename);

  const formData = new FormData();
  const photoDetails = {
    uri: `file://${image.path}`,
    type: "image/jpeg", // The mime type of the file
    name: `photo-${filename}`, // The name of the file
  };
  formData.append("file", photoDetails as any);

  const { data: imageData, error } = await supabase.storage
    .from("item-image")
    .upload(`public/${filename}`, formData);

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(error.message);
  }
  console.log("Image uploaded successfully:", imageData);
  const { data } = supabase.storage
    .from("item-image")
    .getPublicUrl(imageData.path);
  return data;
};
//Updates the amount of an item in the database
export const updateAmount = async (ID: number, amount: number) => {
  // if amount is 0, we delete the item and the image associated with it
  if(amount <= 0){
    console.log("Amount is less than or equal to 0, deleting item and image.");
    deleteItem(ID);
    return;
  }
  

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
export const deleteItem = async (ID: number) => {
  //first we get the item image_url
  const { data, error } = await supabase
    .from("Item")
    .select("image_url")
    .eq("id", ID)
    .single();
  // If there is an error fetching the item, throw an error
  if (error) {
    console.error("Error fetching item for deletion:", error.message);
    throw new Error(error.message);
  }
  // If the item was found, we proceed to delete it
  const imageUrl = data?.image_url;
  const { error: deleteError } = await supabase
    .from("Item")
    .delete()
    .eq("id", ID);

  if (deleteError) {
    console.error("Error deleting item:", deleteError.message);
    throw new Error(deleteError.message);
  }

  // If the item had an image, we delete it from storage
  if (imageUrl) {
    const { error: storageError } = await supabase.storage
      .from("item-image")
      .remove([`public/${imageUrl.split("/").pop()}`]);

    if (storageError) {
      console.error("Error deleting item image:", storageError.message);
      throw new Error(storageError.message);
    }
  }
}