import { useUserData } from "./useUserData";

export interface BibleStudy {
  id: string;
  user_id: string;
  name: string;
  frequency: string;
  last_study?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function useBibleStudies() {
  // Empty array as default value when no data exists
  return useUserData<BibleStudy>("bible_studies", []);
}
