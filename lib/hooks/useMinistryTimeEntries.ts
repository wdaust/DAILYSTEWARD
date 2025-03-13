import { useUserData } from "./useUserData";

export interface MinistryTimeEntry {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  minutes: number;
  ministry_type?: string;
  type: "weekly" | "monthly";
  created_at?: string;
}

export function useMinistryTimeEntries() {
  // Empty array as default value when no data exists
  return useUserData<MinistryTimeEntry>("ministry_time_entries", []);
}
