import { useUserData } from "./useUserData";

export interface MinistryStats {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  type: "daily" | "weekly" | "monthly";
  ministryType?: string; // Track which type of ministry was done
}

export function useMinistryStats() {
  // Empty array as default value when no data exists
  return useUserData<MinistryStats>("ministry_stats", []);
}
