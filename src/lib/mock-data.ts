import { User, Group, GroupMember, Message } from "./db-types";

const mockUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "Koushic Sumathi Kumar",
  email: "koushic@koushic.com",
  phone_number: "+1234567890",
  two_factor_auth: true,
  password_hash: "$2b$12$eW5FgH6V7Yx2B3ZfjnhlXOe5LnV.CdYFbZm/jaMWB8O0E/cQuH2ba",
  profile_pic: "",
  bio: "Junior Full-Stack Developer",
  created_at: "2025-05-21T12:34:56Z",
};

export default mockUser;

const generateTimestamp = (dayAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - dayAgo);
  return date.toISOString();
};

export const createMockUsers = async (): Promise<User[]> => {
  return [
    {
      id: "user-1",
      username: "Koushic Sumathi Kumar",
      email: "koushic@koushic.com",
      phone_number: "+1234567890",
      two_factor_auth: true,
      password_hash:
        "$2b$12$eW5FgH6V7Yx2B3ZfjnhlXOe5LnV.CdYFbZm/jaMWB8O0E/cQuH2ba",
      profile_pic: "",
      bio: "Junior Full-Stack Developer",
      created_at: generateTimestamp(30),
    },
    {
      id: "user-2",
      username: "Lewis Rye",
      email: "lewis@lewis.com",
      phone_number: "+1234567890",
      two_factor_auth: true,
      password_hash:
        "$2b$12$eW5FgH6V7Yx2B3ZfjnhlXOe5LnV.CdYFbZm/jaMWB8O0E/cQuH2ba",
      profile_pic: "",
      bio: "Junior Full-Stack Developer",
      created_at: generateTimestamp(25),
    },
    {
      id: "user-3",
      username: "Taisei Yokoshima",
      email: "taisei@taisei.com",
      phone_number: "+1234567890",
      two_factor_auth: true,
      password_hash:
        "$2b$12$eW5FgH6V7Yx2B3ZfjnhlXOe5LnV.CdYFbZm/jaMWB8O0E/cQuH2ba",
      profile_pic: "",
      bio: "Junior Full-Stack Developer",
      created_at: generateTimestamp(20),
    },
  ];
};

export const createMockGroups = (users: User[]): Group[] => {
  const groups: Group[] = [
    {
      id: "1",
      name: "War Council",
      description: "GOATS",
      created_at: generateTimestamp(20),
      created_by: "user-1",
      is_dm: false,
    },
    {
      id: "2",
      name: "War Council but BETTER",
      description: "GOATS SQUARED",
      created_at: generateTimestamp(15),
      created_by: "user-1",
      is_dm: false,
    },
  ];
  for (let i = 1; i < users.length; i++) {
    groups.push({
      id: `dm-${i}`,
      name: `${users[i].username}`,
      created_at: generateTimestamp(10 + i),
      created_by: users[0].id,
      is_dm: true,
    });
  }
  return groups;
};

export const createdMockGroupMembers = (
  users: User[],
  groups: Group[]
): GroupMember[] => {
  const groupMembers: GroupMember[] = [];

  groups
    .filter((g) => !g.is_dm)
    .forEach((group) => {
      users.forEach((user, index) => {
        groupMembers.push({
          user_id: user.id,
          group_id: group.id,
          joined_at: generateTimestamp(19 - index),
          role: user.id === group.created_by ? "admin" : "member",
        });
      });
    });

  groups
    .filter((g) => g.is_dm)
    .forEach((group, index) => {
      groupMembers.push({
        user_id: users[0].id,
        group_id: group.id,
        joined_at: generateTimestamp(10),
        role: "member",
      });

      groupMembers.push({
        user_id: users[index + 1].id,
        group_id: group.id,
        joined_at: generateTimestamp(10),
        role: "member",
      });
    });
  return groupMembers;
};

export const createMockMessages = (
  users: User[],
  groups: Group[]
): Message[] => {
  const messages: Message[] = [];
  const messageContents = [
    "Test Message 1",
    "Test Message 2",
    "Test Message 3",
    "Test Message 4",
    "Test Message 5",
    "Test Message 6",
  ];

  groups.forEach((group) => {
    const memberIds = group.is_dm
      ? ([
          group.created_by,
          users.find((u) => u.id !== group.created_by)?.id,
        ].filter(Boolean) as string[])
      : users.map((u) => u.id);

    const messageCount = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < messageCount; i++) {
      const usersId = memberIds[Math.floor(Math.random() * memberIds.length)];
      const daysAgo = Math.floor(Math.random() * 10);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);

      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      date.setMinutes(date.getMinutes() - minutesAgo);

      messages.push({
        id: `${group.id}-msg-${i}`,
        group_id: group.id,
        user_id: usersId,
        content:
          messageContents[Math.floor(Math.random() * messageContents.length)],
        created_at: date.toISOString(),
        is_deleted: false,
        is_read: false,
      });
    }
  });
  return messages.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
};

// Initailise all mock data
export const initMockData = async () => {
  const users = await createMockUsers();
  const groups = createMockGroups(users);
  const groupMembers = createdMockGroupMembers(users, groups);
  const messages = createMockMessages(users, groups);

  return { users, groups, groupMembers, messages };
};

let mockData: {
  users: User[];
  groups: Group[];
  groupMembers: GroupMember[];
  messages: Message[];
} | null = null;

export const getMockData = async () => {
  if (!mockData) {
    mockData = await initMockData();
  }
  return mockData;
};
