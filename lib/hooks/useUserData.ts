import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../auth";

// Generic hook for fetching user-specific data
export function useUserData<T>(tableName: string, defaultValue: T[]) {
  const [data, setData] = useState<T[]>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Don't fetch data if user is not authenticated
    if (!user) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Query data for the specific user
        const { data: userData, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        setData(userData || []);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Return empty array on error
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, user]);

  // Function to add new data
  const addData = async (newData: Omit<T, "id" | "user_id">) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([{ ...newData, user_id: user.id }])
        .select();

      if (error) throw error;

      // Update local state with the new data
      setData((prev) => [...prev, ...(insertedData as T[])]);
      return { data: insertedData, error: null };
    } catch (err) {
      console.error(`Error adding to ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  // Function to update existing data
  const updateData = async (id: string, updates: Partial<T>) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user can only update their own data
        .select();

      if (error) throw error;

      // Update local state
      setData((prev) =>
        prev.map((item) =>
          (item as any).id === id ? { ...item, ...updates } : item,
        ),
      );
      return { data: updatedData, error: null };
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  // Function to delete data
  const deleteData = async (id: string) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Ensure user can only delete their own data

      if (error) throw error;

      // Update local state
      setData((prev) => prev.filter((item) => (item as any).id !== id));
      return { error: null };
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  return { data, isLoading, error, addData, updateData, deleteData };
}
