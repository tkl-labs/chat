export type User = {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  two_factor_auth: boolean;
  password_hash: string;
  profile_pic?: string;
  bio?: string;
  created_at: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  is_dm: boolean;
};

export type GroupMember = {
  user_id: string;
  group_id: string;
  joined_at: string;
  role: "member" | "admin" | "staff";
};

export type Message = {
    id: string;
    group_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at?: string;
    is_deleted: boolean;
    is_read: boolean;
}