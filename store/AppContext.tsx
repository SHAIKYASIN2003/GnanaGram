import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Story, Message, Chat } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', username: 'alex_creator', fullName: 'Alex Rivera', avatarUrl: 'https://picsum.photos/seed/alex/150/150', bio: 'Digital Artist 🎨 | SF', followers: 1205, following: 450, isVerified: true },
  { id: 'u2', username: 'gemini_fan', fullName: 'Gemini User', avatarUrl: 'https://picsum.photos/seed/gem/150/150', bio: 'Exploring the universe 🌌', followers: 890, following: 200 },
  { id: 'u3', username: 'travel_bug', fullName: 'Sarah Jenkins', avatarUrl: 'https://picsum.photos/seed/sarah/150/150', bio: 'Wanderlust ✈️', followers: 5400, following: 120 },
  { id: 'ai_bot', username: 'gemini_ai', fullName: 'Gemini Assistant', avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', bio: 'I am your AI assistant.', followers: 1000000, following: 0, isVerified: true }
];

const CURRENT_USER_ID = 'u1';

const MOCK_POSTS: Post[] = [
  { id: 'p1', userId: 'u2', imageUrl: 'https://picsum.photos/seed/nature/800/800', caption: 'Found this amazing spot today! #nature #vibes', likes: ['u1', 'u3'], comments: [], timestamp: Date.now() - 3600000, aspectRatio: 1 },
  { id: 'p2', userId: 'u3', imageUrl: 'https://picsum.photos/seed/city/800/1000', caption: 'City lights never sleep 🌃', likes: ['u2'], comments: [], timestamp: Date.now() - 7200000, location: 'New York, NY', aspectRatio: 0.8 },
];

const MOCK_STORIES: Story[] = [
    { id: 's1', userId: 'u2', imageUrl: 'https://picsum.photos/seed/story1/600/1000', isViewed: false, timestamp: Date.now() },
    { id: 's2', userId: 'u3', imageUrl: 'https://picsum.photos/seed/story2/600/1000', isViewed: false, timestamp: Date.now() },
];

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  messages: Message[];
  sendMessage: (receiverId: string, text: string) => void;
  toggleFollow: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [messages, setMessages] = useState<Message[]>([
      { id: 'm1', senderId: 'ai_bot', receiverId: 'u1', text: 'Hi Alex! I can help you write captions or find ideas.', timestamp: Date.now(), isRead: false }
  ]);

  const currentUser = users.find(u => u.id === CURRENT_USER_ID) || users[0];

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likes.includes(currentUser.id);
        return {
          ...p,
          likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, text: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now().toString(), userId: currentUser.id, text, timestamp: Date.now() }]
        };
      }
      return p;
    }));
  };

  const sendMessage = (receiverId: string, text: string) => {
      const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          receiverId,
          text,
          timestamp: Date.now(),
          isRead: false
      };
      setMessages(prev => [...prev, newMessage]);
  };

  const toggleFollow = (userId: string) => {
      // In a real app, this would update followers/following lists.
      // Visual only for now
      console.log(`Toggled follow for ${userId}`);
  };

  return (
    <AppContext.Provider value={{ currentUser, users, posts, stories, addPost, likePost, addComment, messages, sendMessage, toggleFollow }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
