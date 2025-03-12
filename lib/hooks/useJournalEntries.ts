import { useUserData } from "./useUserData";
import { JournalFolder } from "../../components/JournalFolderSelector";

export interface ScriptureTag {
  id: string;
  reference: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  preview: string;
  content: string;
  scriptures: string[];
  folder?: JournalFolder | null;
  tags?: ScriptureTag[];
}

export function useJournalEntries() {
  // Empty array as default value when no data exists
  return useUserData<JournalEntry>("journal_entries", []);
}
