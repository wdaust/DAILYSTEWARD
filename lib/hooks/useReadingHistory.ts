import { useUserData } from "./useUserData";

export interface ReadingDay {
  id: string;
  user_id?: string;
  date: string;
  completed: boolean;
  content: string;
  method: string;
}

export function useReadingHistory() {
  // Empty array as default value when no data exists
  return useUserData<ReadingDay>("reading_history", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => ({
      id: dbItem.id,
      user_id: dbItem.user_id,
      date: dbItem.date,
      completed: dbItem.completed || false,
      content: dbItem.content || "",
      method: dbItem.method || "chapter",
    }),
    // Map our interface to database fields
    toDB: (item) => ({
      date: item.date,
      completed: item.completed,
      content: item.content,
      method: item.method,
    }),
  });
}
