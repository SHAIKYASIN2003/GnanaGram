import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { useApp } from '../store/AppContext';
import { Icons } from './Icons';

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ post, isOpen, onClose }) => {
  const { updatePost, currentUser } = useApp();
  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location || '');
  const [aspectRatio, setAspectRatio] = useState(post.aspectRatio || 1);

  // Sync state if post changes
  useEffect(() => {
      setCaption(post.caption);
      setLocation(post.location || '');
      setAspectRatio(post.aspectRatio || 1);
  }, [post]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Save history if caption changed
    const historyEntry = post.caption !== caption 
        ? { caption: post.caption, timestamp: Date.now() }
        : null;

    const newHistory = historyEntry 
        ? [...(post.editHistory || []), historyEntry]
        : post.editHistory;

    updatePost({
      ...post,
      caption,
      location,
      aspectRatio,
      editHistory: newHistory
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl w-full max-w-5xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden border border-zinc-800 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900 z-10 shrink-0">
          <button onClick={onClose} className="text-white font-medium hover:opacity-70">Cancel</button>
          <span className="font-bold text-white text-base">Edit Info</span>
          <button 
            onClick={handleSave} 
            className="text-blue-500 font-bold text-sm hover:text-blue-400"
          >
            Done
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row bg-black overflow-hidden">
            {/* Image Preview */}
            <div className="flex-1 bg-black flex items-center justify-center md:border-r border-zinc-800 overflow-hidden relative p-6">
                 <div 
                    className="relative shadow-2xl bg-zinc-800 overflow-hidden transition-all duration-300"
                    style={{ 
                        aspectRatio: aspectRatio,
                        height: aspectRatio <= 1 ? '100%' : 'auto',
                        width: aspectRatio > 1 ? '100%' : 'auto',
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}
                 >
                     <img 
                        src={post.imageUrl} 
                        className="w-full h-full object-cover" 
                        alt="Preview" 
                     />
                 </div>
            </div>
            
            {/* Editor Sidebar */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col bg-zinc-900 border-l border-zinc-800 shrink-0 overflow-y-auto">
              <div className="p-4 flex items-center space-x-3 border-b border-zinc-800 shrink-0">
                <img src={currentUser?.avatarUrl} className="w-8 h-8 rounded-full" alt="User" />
                <span className="font-semibold text-sm text-white">{currentUser?.username}</span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col space-y-4">
                  <textarea 
                    className="bg-transparent w-full text-sm resize-none focus:outline-none h-24 text-white placeholder-zinc-500" 
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  
                  {/* Location */}
                   <div className="border-t border-zinc-800 pt-3">
                     <div className="flex items-center justify-between mb-2">
                        <input
                            className="bg-transparent w-full text-sm focus:outline-none text-white placeholder-zinc-500"
                            placeholder="Add location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Icons.MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                     </div>
                   </div>

                   {/* Aspect Ratio Control */}
                   <div className="border-t border-zinc-800 pt-3">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-white">Aspect Ratio</span>
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setAspectRatio(1)}
                            className={`px-2 py-2 rounded text-xs font-medium transition-all border ${
                                aspectRatio === 1
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                            }`}
                        >
                            Square (1:1)
                        </button>
                        <button
                            onClick={() => setAspectRatio(0.8)}
                            className={`px-2 py-2 rounded text-xs font-medium transition-all border ${
                                aspectRatio === 0.8
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                            }`}
                        >
                            Portrait (4:5)
                        </button>
                        <button
                            onClick={() => setAspectRatio(1.91)}
                            className={`px-2 py-2 rounded text-xs font-medium transition-all border ${
                                Math.abs(aspectRatio - 1.91) < 0.01
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                            }`}
                        >
                            Landscape
                        </button>
                     </div>
                   </div>

                   {/* Edit History Display */}
                   {post.editHistory && post.editHistory.length > 0 && (
                       <div className="border-t border-zinc-800 pt-3">
                           <div className="text-sm font-medium text-white mb-2">Edit History</div>
                           <div className="space-y-2">
                               {post.editHistory.map((h, i) => (
                                   <div key={i} className="text-xs text-zinc-500">
                                       <div className="mb-0.5">{new Date(h.timestamp).toLocaleDateString()}</div>
                                       <div className="italic">"{h.caption}"</div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};