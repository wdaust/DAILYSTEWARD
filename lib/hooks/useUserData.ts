import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../auth";
import { Platform } from "react-native";

interface DataMappers<T, DBType = any> {
  fromDB?: (dbItem: DBType) => T;
  toDB?: (item: Partial<T>) => Partial<DBType>;
}

// Generic hook for fetching user-specific data
export function useUserData<T, DBType = any>(
  tableName: string,
  defaultValue: T[],
  mappers: DataMappers<T, DBType> = {},
) {
  const [data, setData] = useState<T[]>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Default mappers if none provided
  const fromDB = mappers.fromDB || ((item: any) => item as T);
  const toDB = mappers.toDB || ((item: Partial<T>) => item as Partial<DBType>);

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

        // Map database items to our interface
        const mappedData = userData ? userData.map(fromDB) : [];
        setData(mappedData);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Return empty array on error
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Try to load from localStorage first for backward compatibility
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(tableName);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setData(parsedData);
          }
        }
      } catch (e) {
        console.error(
          `Failed to parse saved ${tableName} from localStorage`,
          e,
        );
      }
    }

    fetchData();
  }, [tableName, user]);

  // Function to add new data
  const addData = async (newData: Omit<T, "id" | "user_id">) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      // Map the data to database format
      const dbData = toDB(newData as Partial<T>);

      // Clean up any empty date fields to prevent SQL errors
      const cleanedData = Object.entries(dbData).reduce((acc, [key, value]) => {
        // If the field is a date field and the value is an empty string, set it to null
        if (
          (key.includes("date") ||
            key.includes("_at") ||
            key.includes("completed")) &&
          value === ""
        ) {
          acc[key] = null;
        } else if (key === "show_on_dashboard" && value === undefined) {
          // Default showOnDashboard to true if undefined
          acc[key] = true;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Add a small delay to prevent stream closure issues
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([{ ...cleanedData, user_id: user.id }])
        .select();

      if (error) throw error;

      // Add another small delay after database operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Map the inserted data back to our interface
      const mappedData = insertedData ? insertedData.map(fromDB) : [];

      // Update local state with the new data
      setData((prev) => [...prev, ...mappedData]);

      // For backward compatibility, also update localStorage
      if (Platform.OS === "web" && typeof window !== "undefined") {
        try {
          const updatedData = [...data, ...mappedData];
          localStorage.setItem(tableName, JSON.stringify(updatedData));

          // Trigger event for components using localStorage
          const event = new Event(`${tableName}Updated`);
          window.dispatchEvent(event);
        } catch (e) {
          console.error(`Failed to update ${tableName} in localStorage`, e);
        }
      }

      return { data: mappedData, error: null };
    } catch (err) {
      console.error(`Error adding to ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  // Function to update existing data
  const updateData = async (id: string, updates: Partial<T>) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      // Map the updates to database format
      const dbUpdates = toDB(updates);

      // Clean up any empty date fields to prevent SQL errors
      const cleanedUpdates = Object.entries(dbUpdates).reduce(
        (acc, [key, value]) => {
          // If the field is a date field and the value is an empty string, set it to null
          if (
            (key.includes("date") ||
              key.includes("_at") ||
              key.includes("completed")) &&
            value === ""
          ) {
            acc[key] = null;
          } else if (key === "show_on_dashboard" && value === undefined) {
            // Default showOnDashboard to true if undefined
            acc[key] = true;
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      // Add a small delay to prevent stream closure issues
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(cleanedUpdates)
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user can only update their own data
        .select();

      if (error) throw error;

      // Add another small delay after database operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Map the updated data back to our interface
      const mappedData = updatedData ? updatedData.map(fromDB) : [];

      // Update local state with the mapped data or fallback to direct updates
      if (mappedData && mappedData.length > 0) {
        setData((prev) =>
          prev.map((item) => ((item as any).id === id ? mappedData[0] : item)),
        );
      } else {
        setData((prev) =>
          prev.map((item) =>
            (item as any).id === id ? { ...item, ...updates } : item,
          ),
        );
      }

      // For backward compatibility, also update localStorage
      if (Platform.OS === "web" && typeof window !== "undefined") {
        try {
          localStorage.setItem(tableName, JSON.stringify(data));

          // Trigger event for components using localStorage
          const event = new Event(`${tableName}Updated`);
          window.dispatchEvent(event);
        } catch (e) {
          console.error(`Failed to update ${tableName} in localStorage`, e);
        }
      }

      return { data: mappedData, error: null };
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  // Function to delete data
  const deleteData = async (id: string) => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      // Add a small delay to prevent stream closure issues
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Ensure user can only delete their own data

      if (error) throw error;

      // Add another small delay after database operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update local state
      const updatedData = data.filter((item) => (item as any).id !== id);
      setData(updatedData);

      // For backward compatibility, also update localStorage
      if (Platform.OS === "web" && typeof window !== "undefined") {
        try {
          localStorage.setItem(tableName, JSON.stringify(updatedData));

          // Trigger event for components using localStorage
          const event = new Event(`${tableName}Updated`);
          window.dispatchEvent(event);
        } catch (e) {
          console.error(`Failed to update ${tableName} in localStorage`, e);
        }
      }

      return { error: null };
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  return { data, isLoading, error, addData, updateData, deleteData, setData };
}
