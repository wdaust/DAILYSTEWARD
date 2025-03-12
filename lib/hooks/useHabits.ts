import { useUserData } from "./useUserData";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  category: "prayer" | "study" | "meeting" | "ministry" | "other";
  streak: number;
  completedToday: boolean;
  lastCompleted: string;
  progress: number;
  type: string;
  showOnDashboard: boolean;
  reminderTime?: string;
  createdAt: string;
  completionHistory: { date: string; completed: boolean }[];
}

export function useHabits() {
  // Empty array as default value when no data exists
  return useUserData<Habit>("habits", []);
}
