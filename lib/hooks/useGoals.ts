import { useUserData } from "./useUserData";

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  deadline: string;
  category: "spiritual" | "ministry" | "personal" | "family" | "other";
  progress: number;
  subGoals: SubGoal[];
  createdAt?: string;
  notes?: string;
}

export function useGoals() {
  // Empty array as default value when no data exists
  return useUserData<Goal>("goals", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => ({
      id: dbItem.id,
      user_id: dbItem.user_id,
      title: dbItem.title,
      description: dbItem.description || "",
      deadline: dbItem.deadline || new Date().toISOString().split("T")[0],
      category: (dbItem.category as any) || "spiritual",
      progress: dbItem.progress || 0,
      subGoals: dbItem.sub_goals ? JSON.parse(dbItem.sub_goals as string) : [],
      createdAt: dbItem.created_at,
      notes: dbItem.notes,
    }),
    // Map our interface to database fields
    toDB: (item) => ({
      title: item.title,
      description: item.description,
      deadline: item.deadline,
      category: item.category,
      progress: item.progress,
      sub_goals: JSON.stringify(item.subGoals),
      notes: item.notes,
    }),
  });
}
