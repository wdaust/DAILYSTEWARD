import { useUserData } from "./useUserData";

export interface ReadingDay {
  id: string;
  user_id?: string;
  date: string;
  completed: boolean;
  content: string;
  method: string;
  completedChapters?: string[];
  completedVerses?: string[];
  totalPages?: number;
  completedPages?: number[];
  // Add any additional fields that might be in the database
  completed_chapters?: string;
  completed_verses?: string;
  completed_pages?: string;
  total_pages?: number;
}

export function useReadingHistory() {
  // Empty array as default value when no data exists
  return useUserData<ReadingDay>("reading_history", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => {
      let completedChapters = [];
      let completedVerses = [];
      let completedPages = [];

      try {
        if (
          dbItem.completed_chapters &&
          typeof dbItem.completed_chapters === "string"
        ) {
          completedChapters = JSON.parse(dbItem.completed_chapters);
        }
        if (
          dbItem.completed_verses &&
          typeof dbItem.completed_verses === "string"
        ) {
          completedVerses = JSON.parse(dbItem.completed_verses);
        }
        if (
          dbItem.completed_pages &&
          typeof dbItem.completed_pages === "string"
        ) {
          completedPages = JSON.parse(dbItem.completed_pages);
        }
      } catch (error) {
        console.error("Error parsing reading history data:", error);
      }

      return {
        id: dbItem.id,
        user_id: dbItem.user_id,
        date: dbItem.date,
        completed: dbItem.completed || false,
        content: dbItem.content || "",
        method: dbItem.method || "chapter",
        completedChapters: Array.isArray(completedChapters)
          ? completedChapters
          : [],
        completedVerses: Array.isArray(completedVerses) ? completedVerses : [],
        totalPages: dbItem.total_pages || 0,
        completedPages: Array.isArray(completedPages) ? completedPages : [],
      };
    },
    // Map our interface to database fields
    toDB: (item) => {
      console.log("Saving reading history to DB:", item);

      let completedChaptersStr = "[]";
      let completedVersesStr = "[]";
      let completedPagesStr = "[]";

      try {
        // If the item already has stringified arrays, use them directly
        if (typeof item.completed_chapters === "string") {
          completedChaptersStr = item.completed_chapters;
        } else if (
          item.completedChapters &&
          Array.isArray(item.completedChapters)
        ) {
          completedChaptersStr = JSON.stringify(item.completedChapters);
        }

        if (typeof item.completed_verses === "string") {
          completedVersesStr = item.completed_verses;
        } else if (
          item.completedVerses &&
          Array.isArray(item.completedVerses)
        ) {
          completedVersesStr = JSON.stringify(item.completedVerses);
        }

        if (typeof item.completed_pages === "string") {
          completedPagesStr = item.completed_pages;
        } else if (item.completedPages && Array.isArray(item.completedPages)) {
          completedPagesStr = JSON.stringify(item.completedPages);
        }
      } catch (error) {
        console.error("Error stringifying reading history data:", error);
      }

      // Ensure we're using the correct field names for the database
      const dbItem = {
        date: item.date,
        completed: item.completed === undefined ? false : item.completed,
        content: item.content || "",
        method: item.method || "chapter",
        completed_chapters: completedChaptersStr,
        completed_verses: completedVersesStr,
        total_pages: item.total_pages || item.totalPages || 0,
        completed_pages: completedPagesStr,
      };

      console.log("Final data being sent to DB:", dbItem);
      return dbItem;
    },
  });
}
