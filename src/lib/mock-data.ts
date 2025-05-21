import { User } from "./db-types";

const mockUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "Koushic Sumathi Kumar",
  email: "koushic@koushic.com",
  phone_number: "+1234567890",
  two_factor_auth: true,
  password_hash: "$2b$12$eW5FgH6V7Yx2B3ZfjnhlXOe5LnV.CdYFbZm/jaMWB8O0E/cQuH2ba",
  profile_pic: "",
  bio: "Junior Full-Stack Developer",
  created_at: "2025-05-21T12:34:56Z"
};

export default mockUser;