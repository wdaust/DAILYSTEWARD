import { useUserData } from "./useUserData";

export interface Habit {
  id: string;
  user_id?: string;
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
  createdAt?: string;
  completionHistory: { date: string; completed: boolean }[];
}

export function useHabits() {
  // Empty array as default value when no data exists
  return useUserData<Habit>("habits", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => ({
      id: dbItem.id,
      user_id: dbItem.user_id,
      name: dbItem.name,
      description: dbItem.description || "",
      frequency: dbItem.frequency as "daily" | "weekly" | "monthly",
      category: (dbItem.category as any) || "prayer",
      streak: dbItem.streak || 0,
      completedToday: dbItem.completed_today || false,
      lastCompleted: dbItem.last_completed || "",
      progress: dbItem.progress || 0,
      type: dbItem.type || "prayer",
      showOnDashboard: dbItem.show_on_dashboard || false,
      reminderTime: dbItem.reminder_time,
      createdAt: dbItem.created_at,
      completionHistory: dbItem.completion_history
        ? JSON.parse(dbItem.completion_history as string)
        : [],
    }),
    // Map our interface to database fields
    toDB: (item) => ({
      name: item.name,
      description: item.description,
      frequency: item.frequency,
      category: item.category,
      streak: item.streak,
      completed_today: item.completedToday,
      last_completed: item.lastCompleted,
      progress: item.progress,
      type: item.type,
      show_on_dashboard: item.showOnDashboard,
      reminder_time: item.reminderTime,
      completion_history: JSON.stringify(item.completionHistory),
    }),
  });
}
