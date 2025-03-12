import { useUserData } from "./useUserData";

export interface MinistryStats {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  placements: number;
  returnVisits: number;
  type: "daily" | "weekly" | "monthly";
}

export function useMinistryStats() {
  // Empty array as default value when no data exists
  return useUserData<MinistryStats>("ministry_stats", []);
}
