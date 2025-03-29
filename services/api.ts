import supabase from "./supabase";

export const fetchItems = async ({ query }: { query: string }) => {
  const { data, error } = await supabase.from("Item").select("*");
  console.log("data", data);
  if (error) {
    console.error("Error fetching items:", error.message);
    throw new Error(error.message);
  }

  return data;
};
