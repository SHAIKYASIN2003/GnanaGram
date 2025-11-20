export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  highlights?: Highlight[];
  isAdmin?: boolean;
  
  // New Profile Edit Fields
  email?: string;
  phone?: string;
  links?: { title: string; url: string }[];
  isPrivate?: boolean;
  themeColor?: string;
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
  stories: Story[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  isPinned?: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
}

export interface ProductTag {
  id: string;
  name: string;
  price: string;
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
  music?: AudioTrack;
  tags?: string[];
  isFlagged?: boolean;
  
  // New Features
  coAuthors?: string[]; // IDs of other users
  scheduledTime?: number; // Timestamp for future publish
  editHistory?: { caption: string; timestamp: number }[];
  productTags?: ProductTag[];
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

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  userId: string; // Originator
  postId?: string;
  text?: string;
  timestamp: number;
  isRead: boolean;
}