import { useUserData } from "./useUserData";

export interface ReadingDay {
  id: string;
  user_id: string;
  date: string;
  completed: boolean;
  content: string;
  method: string;
}

export function useReadingHistory() {
  // Empty array as default value when no data exists
  return useUserData<ReadingDay>("reading_history", []);
}
