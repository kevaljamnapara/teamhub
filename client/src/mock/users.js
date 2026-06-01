export const mockUsers = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex.johnson@teamhub.io",
    role: "Project Manager",
    bio: "Experienced PM with 8+ years in agile environments. Passionate about building great teams.",
    avatar: null,
    status: "online",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah.chen@teamhub.io",
    role: "Frontend Developer",
    bio: "React enthusiast and UI/UX advocate. Love creating pixel-perfect interfaces.",
    avatar: null,
    status: "online",
  },
  {
    id: "u3",
    name: "Marcus Rivera",
    email: "marcus.rivera@teamhub.io",
    role: "Backend Developer",
    bio: "Full-stack developer specialized in Node.js and cloud architecture.",
    avatar: null,
    status: "away",
  },
  {
    id: "u4",
    name: "Priya Patel",
    email: "priya.patel@teamhub.io",
    role: "Designer",
    bio: "Product designer focused on creating intuitive and accessible experiences.",
    avatar: null,
    status: "offline",
  },
  {
    id: "u5",
    name: "Jordan Kim",
    email: "jordan.kim@teamhub.io",
    role: "DevOps Engineer",
    bio: "Infrastructure and CI/CD specialist. Keeping the pipelines green.",
    avatar: null,
    status: "online",
  },
];

export const currentUser = {
  ...mockUsers[0],
  password: "hashed_password",
  createdAt: "2024-01-15T10:00:00Z",
};
