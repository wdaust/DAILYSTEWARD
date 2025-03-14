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
  lastCompleted: string | null;
  progress: number;
  type: string;
  showOnDashboard: boolean;
  reminderTime?: string | null;
  createdAt?: string;
  completionHistory: { date: string; completed: boolean }[];
}

export function useHabits() {
  // Empty array as default value when no data exists
  const { data, isLoading, error, addData, updateData, deleteData, setData } =
    useUserData<Habit>("habits", [], {
      // Map database fields to our interface
      fromDB: (dbItem) => {
        let completionHistory = [];
        try {
          if (
            dbItem.completion_history &&
            typeof dbItem.completion_history === "string"
          ) {
            completionHistory = JSON.parse(dbItem.completion_history);
          }
        } catch (error) {
          console.error("Error parsing completion history:", error);
          // Provide a fallback if parsing fails
          completionHistory = [];
        }

        return {
          id: dbItem.id,
          user_id: dbItem.user_id,
          name: dbItem.name || "",
          description: dbItem.description || "",
          frequency:
            (dbItem.frequency as "daily" | "weekly" | "monthly") || "daily",
          category: (dbItem.category as any) || "prayer",
          streak: dbItem.streak || 0,
          completedToday: dbItem.completed_today || false,
          lastCompleted: dbItem.last_completed,
          progress: dbItem.progress || 0,
          type: dbItem.type || "prayer",
          showOnDashboard: dbItem.show_on_dashboard === false ? false : true, // Default to true if null/undefined
          reminderTime: dbItem.reminder_time,
          createdAt: dbItem.created_at,
          completionHistory: Array.isArray(completionHistory)
            ? completionHistory
            : [],
        };
      },
      // Map our interface to database fields
      toDB: (item) => {
        let completionHistoryStr = "[]";
        try {
          if (item.completionHistory && Array.isArray(item.completionHistory)) {
            completionHistoryStr = JSON.stringify(item.completionHistory);
          }
        } catch (error) {
          console.error("Error stringifying completion history:", error);
        }

        console.log("Converting habit to DB format:", item);

        return {
          name: item.name,
          description: item.description,
          frequency: item.frequency,
          category: item.category || "prayer",
          streak: item.streak || 0,
          completed_today: item.completedToday || false,
          last_completed: item.lastCompleted || null,
          progress: item.progress || 0,
          type: item.type || "prayer",
          show_on_dashboard: item.showOnDashboard !== false ? true : false, // Ensure it's always a boolean
          reminder_time: item.reminderTime || null,
          completion_history: completionHistoryStr,
        };
      },
    });

  return { data, isLoading, error, addData, updateData, deleteData, setData };
}
