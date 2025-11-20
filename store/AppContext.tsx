import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Story, Message, Chat, Notification, Highlight } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { 
      id: 'u1', 
      username: 'alex_creator', 
      fullName: 'Alex Rivera', 
      avatarUrl: 'https://picsum.photos/seed/alex/150/150', 
      bio: 'Digital Artist 🎨 | SF', 
      followers: 1205, 
      following: 450, 
      isVerified: true, 
      isAdmin: true,
      email: 'alex@example.com',
      isPrivate: false,
      links: [{ title: 'Portfolio', url: 'https://alex.art' }],
      highlights: [
          { id: 'h1', title: 'Art 🎨', coverUrl: 'https://picsum.photos/seed/art/200/200', stories: [] },
          { id: 'h2', title: 'Travel ✈️', coverUrl: 'https://picsum.photos/seed/travel/200/200', stories: [] }
      ]
  },
  { id: 'u2', username: 'gemini_fan', fullName: 'Gemini User', avatarUrl: 'https://picsum.photos/seed/gem/150/150', bio: 'Exploring the universe 🌌', followers: 890, following: 200 },
  { id: 'u3', username: 'travel_bug', fullName: 'Sarah Jenkins', avatarUrl: 'https://picsum.photos/seed/sarah/150/150', bio: 'Wanderlust ✈️', followers: 5400, following: 120 },
  { id: 'ai_bot', username: 'gemini_ai', fullName: 'Gemini Assistant', avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', bio: 'I am your AI assistant.', followers: 1000000, following: 0, isVerified: true }
];

const MOCK_POSTS: Post[] = [
  { 
    id: 'p1', 
    userId: 'u2', 
    imageUrl: 'https://picsum.photos/seed/nature/800/800', 
    caption: 'Found this amazing spot today! #nature #vibes', 
    likes: ['u1', 'u3'], 
    comments: [
      { id: 'c1', userId: 'u1', text: 'Wow! Where is this?', timestamp: Date.now() - 10000, isPinned: true },
      { id: 'c2', userId: 'u3', text: 'Stunning!', timestamp: Date.now() - 5000 }
    ], 
    timestamp: Date.now() - 3600000, 
    aspectRatio: 1, 
    tags: ['nature', 'outdoors'],
    coAuthors: ['u3'] 
  },
  { 
    id: 'p2', 
    userId: 'u3', 
    imageUrl: 'https://picsum.photos/seed/city/800/1000', 
    caption: 'La vie est belle 🌃', 
    likes: ['u2'], 
    comments: [], 
    timestamp: Date.now() - 7200000, 
    location: 'Paris, France', 
    aspectRatio: 0.8, 
    tags: ['city', 'travel', 'night'],
    productTags: [{id: 'pr1', name: 'Vintage Coat', price: '$120'}]
  },
];

const MOCK_STORIES: Story[] = [
    { id: 's1', userId: 'u2', imageUrl: 'https://picsum.photos/seed/story1/600/1000', isViewed: false, timestamp: Date.now() },
    { id: 's2', userId: 'u3', imageUrl: 'https://picsum.photos/seed/story2/600/1000', isViewed: false, timestamp: Date.now() },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'like', userId: 'u2', postId: 'p1', timestamp: Date.now() - 100000, isRead: false },
    { id: 'n2', type: 'follow', userId: 'u3', timestamp: Date.now() - 200000, isRead: false },
    { id: 'n3', type: 'comment', userId: 'u2', postId: 'p1', timestamp: Date.now() - 500000, isRead: true },
];

interface AppContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  pinComment: (postId: string, commentId: string) => void;
  messages: Message[];
  sendMessage: (receiverId: string, text: string) => void;
  toggleFollow: (userId: string) => void;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  flaggedPosts: Post[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState<Message[]>([
      { id: 'm1', senderId: 'ai_bot', receiverId: 'u1', text: 'Hi Alex! I can help you write captions or find ideas.', timestamp: Date.now(), isRead: false }
  ]);

  const login = (email: string) => {
      // Mock login - always logs in as first user
      setCurrentUser(MOCK_USERS[0]);
  };

  const logout = () => {
      setCurrentUser(null);
  };

  const updateUser = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  };

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
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
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now().toString(), userId: currentUser.id, text, timestamp: Date.now(), isPinned: false }]
        };
      }
      return p;
    }));
  };

  const pinComment = (postId: string, commentId: string) => {
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              return {
                  ...p,
                  comments: p.comments.map(c => ({
                      ...c,
                      isPinned: c.id === commentId ? !c.isPinned : c.isPinned
                  }))
              }
          }
          return p;
      }));
  };

  const sendMessage = (receiverId: string, text: string) => {
      if (!currentUser) return;
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
      console.log(`Toggled follow for ${userId}`);
  };

  const flaggedPosts = posts.filter(p => p.isFlagged);

  return (
    <AppContext.Provider value={{ 
        currentUser, users, posts, stories, notifications,
        addPost, updatePost, deletePost, likePost, addComment, pinComment, messages, sendMessage, toggleFollow,
        login, logout, updateUser, flaggedPosts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};