import { useUserData } from "./useUserData";

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  deadline: string;
  category: "spiritual" | "ministry" | "personal" | "family" | "other";
  progress: number;
  subGoals: SubGoal[];
  createdAt: string;
  notes?: string;
}

export function useGoals() {
  // Empty array as default value when no data exists
  return useUserData<Goal>("goals", []);
}
