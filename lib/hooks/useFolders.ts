import { useUserData } from "./useUserData";
import { JournalFolder } from "../../components/JournalFolderSelector";

export function useFolders() {
  // Empty array as default value when no data exists
  return useUserData<JournalFolder>("folders", []);
}
