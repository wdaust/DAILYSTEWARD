import { useUserData } from "./useUserData";
import { JournalFolder } from "../../components/JournalFolderSelector";
import { useFolders } from "./useFolders";

export interface JournalTag {
  id: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  user_id?: string;
  date: string;
  title: string;
  preview: string;
  content: string;
  scriptures: string[];
  folder?: JournalFolder | null;
  tags?: JournalTag[];
}

export function useJournalEntries() {
  const { data: folders } = useFolders();

  // Empty array as default value when no data exists
  return useUserData<JournalEntry>("journal_entries", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => {
      // Find the folder if folder_id is present
      let folder = null;
      if (dbItem.folder_id && folders) {
        folder = folders.find((f) => f.id === dbItem.folder_id) || null;
      }

      // Create tags from scriptures array
      const tags = dbItem.scriptures
        ? dbItem.scriptures.map((scripture) => ({
            id: scripture,
            name: scripture,
          }))
        : [];

      return {
        id: dbItem.id,
        user_id: dbItem.user_id,
        date: dbItem.date,
        title: dbItem.title,
        preview: dbItem.preview || "",
        content: dbItem.content || "",
        scriptures: dbItem.scriptures || [],
        folder: folder,
        tags: tags,
      };
    },
    // Map our interface to database fields
    toDB: (item) => ({
      date: item.date,
      title: item.title,
      content: item.content,
      preview: item.preview,
      scriptures: item.tags ? item.tags.map((tag) => tag.name) : [],
      folder_id: item.folder?.id || null,
    }),
  });
}
