import { useUserData } from "./useUserData";

export interface MinistryType {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
}

export function useMinistryTypes() {
  // Empty array as default value when no data exists
  return useUserData<MinistryType>("ministry_types", []);
}
