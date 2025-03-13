import { useUserData } from "./useUserData";
import { JournalFolder } from "../../components/JournalFolderSelector";

export function useFolders() {
  // Empty array as default value when no data exists
  return useUserData<JournalFolder>("folders", [], {
    // Map database fields to our interface
    fromDB: (dbItem) => ({
      id: dbItem.id,
      name: dbItem.name,
      color: dbItem.color,
      icon: dbItem.icon || undefined,
    }),
    // Map our interface to database fields
    toDB: (item) => ({
      name: item.name,
      color: item.color,
      icon: item.icon,
    }),
  });
}
