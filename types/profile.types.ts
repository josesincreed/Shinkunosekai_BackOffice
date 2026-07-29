export type ProfileRole = "ADMIN" | "EDITOR";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  active: boolean;
  created_at: string;
  updated_at: string;
};
