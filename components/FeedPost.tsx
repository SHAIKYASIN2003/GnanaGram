import React, { useState } from 'react';
import { Post, User } from '../types';
import { Icons } from './Icons';
import { useApp } from '../store/AppContext';

interface FeedPostProps {
  post: Post;
  author: User;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post, author }) => {
  const { currentUser, likePost, addComment, toggleFollow } = useApp();
  const [commentText, setCommentText] = useState('');
  const isLiked = post.likes.includes(currentUser.id);

  const handleLike = () => {
    likePost(post.id);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <article className="w-full max-w-[470px] mx-auto mb-8 border-b border-zinc-800 pb-6 sm:border rounded-lg sm:bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-purple-600 p-[2px]">
            <img src={author.avatarUrl} alt={author.username} className="w-full h-full rounded-full border-2 border-black object-cover" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white mr-2">{author.username}</span>
            <span className="text-zinc-500 text-xs">• {new Date(post.timestamp).toLocaleDateString()}</span>
            {post.location && <div className="text-xs text-white">{post.location}</div>}
          </div>
        </div>
        <button className="text-white"><Icons.More className="w-5 h-5" /></button>
      </div>

      {/* Image */}
      <div 
        className="w-full bg-zinc-900 relative overflow-hidden"
        style={{ aspectRatio: post.aspectRatio || 1 }}
        onDoubleClick={handleLike}
      >
        <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isLiked ? 'opacity-0' : 'opacity-0 pointer-events-none'}`}>
           <Icons.Activity className="w-24 h-24 text-white fill-white animate-bounce" />
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
              <Icons.Activity className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
            <button className="hover:opacity-70 transition-opacity"><Icons.Message className="w-6 h-6 text-white" /></button>
            <button className="hover:opacity-70 transition-opacity"><Icons.Send className="w-6 h-6 text-white" /></button>
          </div>
          <button className="hover:opacity-70 transition-opacity"><Icons.Save className="w-6 h-6 text-white" /></button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2">{post.likes.length} likes</div>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{author.username}</span>
          <span className="text-zinc-200">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
           <div className="text-zinc-500 text-sm mb-2 cursor-pointer">View all {post.comments.length} comments</div>
        )}
        
        {/* Input */}
        <form onSubmit={handleSubmitComment} className="flex items-center text-sm border-t border-zinc-800 pt-3 mt-2">
           <input 
             type="text" 
             placeholder="Add a comment..." 
             className="bg-transparent flex-1 focus:outline-none text-white placeholder-zinc-500"
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
           />
           {commentText && (
             <button type="submit" className="text-blue-500 font-semibold ml-2">Post</button>
           )}
        </form>
      </div>
    </article>
  );
};
