import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { FeedPost } from '../components/FeedPost';
import { StoryViewer } from '../components/StoryViewer';
import { User } from '../types';

export const HomePage = () => {
  const { posts, users, stories } = useApp();
  const [viewingStoryUser, setViewingStoryUser] = useState<User | null>(null);
  
  // Group stories by user
  const userStoriesMap = stories.reduce((acc, story) => {
     if (!acc[story.userId]) acc[story.userId] = [];
     acc[story.userId].push(story);
     return acc;
  }, {} as Record<string, typeof stories>);

  return (
    <div className="flex flex-col items-center w-full pt-4 md:pt-8 px-2">
        {/* Stories Rail */}
        <div className="w-full max-w-[630px] flex space-x-4 overflow-x-auto hide-scrollbar mb-8 pb-2">
            {Object.keys(userStoriesMap).map(userId => {
                const u = users.find(u => u.id === userId);
                if(!u) return null;
                return (
                    <div 
                        key={userId} 
                        className="flex flex-col items-center space-y-1 min-w-[66px] cursor-pointer"
                        onClick={() => setViewingStoryUser(u)}
                    >
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-600">
                            <img src={u.avatarUrl} className="w-full h-full rounded-full border-2 border-black" />
                        </div>
                        <span className="text-xs text-zinc-300 truncate w-16 text-center">{u.username}</span>
                    </div>
                )
            })}
             {/* Add Story Placeholder */}
             <div className="flex flex-col items-center space-y-1 min-w-[66px] cursor-pointer">
                <div className="w-16 h-16 rounded-full border-2 border-zinc-700 flex items-center justify-center bg-zinc-900">
                     <span className="text-2xl text-white">+</span>
                </div>
                <span className="text-xs text-zinc-300">Your story</span>
            </div>
        </div>

        {/* Feed */}
        <div className="w-full max-w-[470px]">
            {posts.map(post => {
               const author = users.find(u => u.id === post.userId);
               return author ? <FeedPost key={post.id} post={post} author={author} /> : null;
            })}
        </div>

        {/* Story Viewer Modal */}
        {viewingStoryUser && (
            <StoryViewer 
                user={viewingStoryUser} 
                stories={userStoriesMap[viewingStoryUser.id]} 
                onClose={() => setViewingStoryUser(null)} 
            />
        )}
    </div>
  );
};