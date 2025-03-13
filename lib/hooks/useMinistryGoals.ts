import { useUserData } from "./useUserData";

export interface MinistryGoal {
  id: string;
  user_id: string;
  type: string; // e.g., "Hours"
  target: number;
  current: number;
  period: "weekly" | "monthly";
  created_at?: string;
  updated_at?: string;
}

export function useMinistryGoals() {
  // Empty array as default value when no data exists
  return useUserData<MinistryGoal>("ministry_goals", []);
}
