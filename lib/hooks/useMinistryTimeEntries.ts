import { useUserData } from "./useUserData";

export interface MinistryTimeEntry {
  id: string;
  user_id?: string;
  date: string;
  hours: number;
  minutes: number;
  ministry_type?: string;
  type: "weekly" | "monthly";
  created_at?: string;
}

export function useMinistryTimeEntries() {
  // Empty array as default value when no data exists
  return useUserData<MinistryTimeEntry>("ministry_time_entries", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => ({
      id: dbItem.id,
      user_id: dbItem.user_id,
      date: dbItem.date,
      hours: dbItem.hours || 0,
      minutes: dbItem.minutes || 0,
      ministry_type: dbItem.ministry_type,
      type: dbItem.type || "monthly",
      created_at: dbItem.created_at,
    }),
    // Map our interface to database fields
    toDB: (item) => ({
      date: item.date,
      hours: item.hours || 0,
      minutes: item.minutes || 0,
      ministry_type: item.ministry_type,
      type: item.type || "monthly",
    }),
  });
}
