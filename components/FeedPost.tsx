import React, { useState } from 'react';
import { Post, User } from '../types';
import { Icons } from './Icons';
import { useApp } from '../store/AppContext';
import { EditPostModal } from './EditPostModal';
import { translateText } from '../services/geminiService';

interface FeedPostProps {
  post: Post;
  author: User;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post, author }) => {
  const { currentUser, users, likePost, addComment, pinComment, deletePost, toggleFollow } = useApp();
  const [commentText, setCommentText] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedCaption, setTranslatedCaption] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const isLiked = post.likes.includes(currentUser?.id || '');
  const isOwnPost = currentUser?.id === post.userId;

  // Resolve co-authors
  const coAuthors = post.coAuthors?.map(id => users.find(u => u.id === id)).filter(Boolean) as User[] || [];

  // Sort comments: Pinned first
  const sortedComments = [...post.comments].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.timestamp - b.timestamp;
  });

  const handleLike = () => {
    likePost(post.id);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this post?')) {
          deletePost(post.id);
      }
      setIsOptionsOpen(false);
  };

  const handleTranslate = async () => {
      if (isTranslated) {
          setIsTranslated(false);
          return;
      }
      if (translatedCaption) {
          setIsTranslated(true);
          return;
      }

      setIsTranslating(true);
      const translation = await translateText(post.caption);
      setTranslatedCaption(translation);
      setIsTranslated(true);
      setIsTranslating(false);
  };

  const handleTip = () => {
      alert(`You sent a $5.00 tip to ${author.username}!`);
  };

  return (
    <article className="w-full max-w-[470px] mx-auto mb-8 border-b border-zinc-800 pb-6 sm:border rounded-lg sm:bg-black overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-purple-600 p-[2px]">
                <img src={author.avatarUrl} alt={author.username} className="w-full h-full rounded-full border-2 border-black object-cover" />
             </div>
             {coAuthors.length > 0 && (
                 <div className="absolute -bottom-1 -right-2 w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 to-purple-600 p-[2px]">
                    <img src={coAuthors[0].avatarUrl} className="w-full h-full rounded-full border-2 border-black object-cover" />
                 </div>
             )}
          </div>
          <div className={coAuthors.length > 0 ? 'pl-2' : ''}>
            <div className="flex items-center">
                <span className="font-semibold text-sm text-white">{author.username}</span>
                {coAuthors.length > 0 && (
                    <span className="text-white text-sm mx-1"> & {coAuthors.map(u => u.username).join(', ')}</span>
                )}
            </div>
            <div className="flex items-center">
                <span className="text-zinc-500 text-xs mr-1">• {new Date(post.timestamp).toLocaleDateString()}</span>
                {post.scheduledTime && post.scheduledTime > Date.now() && (
                    <span className="text-xs bg-zinc-800 px-1.5 rounded text-zinc-400 flex items-center gap-1">
                        <Icons.Clock className="w-3 h-3" /> Scheduled
                    </span>
                )}
            </div>
            {post.location && <div className="text-xs text-white">{post.location}</div>}
          </div>
        </div>
        <button 
            className="text-white hover:opacity-70 transition-opacity"
            onClick={() => setIsOptionsOpen(true)}
        >
            <Icons.More className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div 
        className="w-full bg-zinc-900 relative overflow-hidden group"
        style={{ aspectRatio: post.aspectRatio || 1 }}
        onDoubleClick={handleLike}
      >
        <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isLiked ? 'opacity-0' : 'opacity-0 pointer-events-none'}`}>
           <Icons.Activity className="w-24 h-24 text-white fill-white animate-bounce" />
        </div>
        
        {/* Product Tags */}
        {post.productTags && post.productTags.length > 0 && (
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:bg-white">
                     <Icons.ShoppingBag className="w-3 h-3" />
                     {post.productTags[0].name} • {post.productTags[0].price}
                 </div>
            </div>
        )}
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
          <div className="flex items-center space-x-4">
             {/* Tip Button */}
             <button onClick={handleTip} className="hover:opacity-70 transition-opacity text-yellow-500" title="Tip Creator">
                <Icons.DollarSign className="w-6 h-6" />
             </button>
             <button className="hover:opacity-70 transition-opacity"><Icons.Save className="w-6 h-6 text-white" /></button>
          </div>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2">{post.likes.length} likes</div>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{author.username}</span>
          <span className="text-zinc-200">{isTranslated ? translatedCaption : post.caption}</span>
          
          <div className="mt-1">
              <button 
                onClick={handleTranslate} 
                className="text-xs text-zinc-500 font-semibold hover:text-white flex items-center gap-1"
              >
                  <Icons.Globe className="w-3 h-3" />
                  {isTranslating ? 'Translating...' : (isTranslated ? 'See Original' : 'See Translation')}
              </button>
          </div>
        </div>

        {/* Comments */}
        {sortedComments.length > 0 && (
           <div className="space-y-1 mt-2">
              {sortedComments.map(c => (
                  <div key={c.id} className="text-sm flex justify-between group/comment">
                      <div className="flex-1">
                        <span className="font-semibold mr-2">{users.find(u => u.id === c.userId)?.username}</span>
                        <span className="text-zinc-300">{c.text}</span>
                        {c.isPinned && <span className="ml-2 text-xs text-zinc-500 flex inline-flex items-center gap-0.5"><Icons.Pin className="w-3 h-3 rotate-45" /> Pinned</span>}
                      </div>
                      {isOwnPost && (
                          <button 
                             onClick={() => pinComment(post.id, c.id)}
                             className={`opacity-0 group-hover/comment:opacity-100 p-1 ${c.isPinned ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                             title={c.isPinned ? "Unpin" : "Pin"}
                          >
                              <Icons.Pin className="w-3 h-3" />
                          </button>
                      )}
                  </div>
              ))}
              {post.comments.length > 2 && (
                 <div className="text-zinc-500 text-sm mt-1 cursor-pointer">View all {post.comments.length} comments</div>
              )}
           </div>
        )}
        
        {/* Input */}
        <form onSubmit={handleSubmitComment} className="flex items-center text-sm border-t border-zinc-800 pt-3 mt-3">
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

      {/* Options Modal */}
      {isOptionsOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
            onClick={() => setIsOptionsOpen(false)}
        >
             <div className="bg-zinc-800 w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                 {isOwnPost && (
                     <>
                        <button 
                            className="w-full p-3 text-red-500 font-bold text-sm border-b border-zinc-700 hover:bg-zinc-700 transition-colors"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                        <button 
                            className="w-full p-3 text-white text-sm border-b border-zinc-700 hover:bg-zinc-700 transition-colors"
                            onClick={() => {
                                setIsOptionsOpen(false);
                                setIsEditModalOpen(true);
                            }}
                        >
                            Edit
                        </button>
                     </>
                 )}
                 <button className="w-full p-3 text-white text-sm border-b border-zinc-700 hover:bg-zinc-700 transition-colors">Go to post</button>
                 <button className="w-full p-3 text-white text-sm border-b border-zinc-700 hover:bg-zinc-700 transition-colors">Share to...</button>
                 <button className="w-full p-3 text-white text-sm border-b border-zinc-700 hover:bg-zinc-700 transition-colors">Copy link</button>
                 <button 
                    className="w-full p-3 text-white text-sm hover:bg-zinc-700 transition-colors"
                    onClick={() => setIsOptionsOpen(false)}
                 >
                    Cancel
                 </button>
             </div>
        </div>
      )}

      <EditPostModal 
        post={post} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </article>
  );
};