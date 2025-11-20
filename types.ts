export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  timestamp: number;
  location?: string;
  aspectRatio?: number; // 1 for square, 0.8 for portrait
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  isViewed: boolean;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Chat {
  userId: string;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
}
