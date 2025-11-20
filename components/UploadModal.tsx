import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { useApp } from '../store/AppContext';
import { generateImageCaption } from '../services/geminiService';
import { Post } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addPost } = useApp();
  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep('edit');
    }
  };

  const handleGenerateCaption = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      // Remove header (data:image/jpeg;base64,)
      const base64Content = base64Data.split(',')[1];
      const generated = await generateImageCaption(base64Content, caption);
      setCaption(generated);
      setIsGenerating(false);
    };
  };

  const handleShare = () => {
    if (!selectedFile) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      imageUrl: previewUrl,
      caption: caption,
      likes: [],
      comments: [],
      timestamp: Date.now(),
      aspectRatio: 1,
      location: 'Unknown Location'
    };
    
    addPost(newPost);
    handleClose();
  };

  const handleClose = () => {
    setStep('select');
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-3xl h-[600px] flex flex-col overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
          {step === 'edit' ? (
             <button onClick={() => setStep('select')}><Icons.Back className="w-6 h-6" /></button>
          ) : (
             <button onClick={handleClose}><Icons.Close className="w-6 h-6" /></button>
          )}
          <span className="font-semibold">Create new post</span>
          {step === 'edit' ? (
            <button onClick={handleShare} className="text-blue-500 font-bold text-sm hover:text-blue-400">Share</button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row bg-black">
          {step === 'select' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <Icons.Image className="w-20 h-20 text-zinc-700" />
              <p className="text-xl">Drag photos and videos here</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                Select from computer
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <>
              {/* Image Preview */}
              <div className="flex-1 bg-black flex items-center justify-center border-r border-zinc-800">
                 <img src={previewUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
              </div>
              
              {/* Editor Sidebar */}
              <div className="w-full md:w-80 flex flex-col bg-zinc-900 border-l border-zinc-800">
                <div className="p-4 flex items-center space-x-3 border-b border-zinc-800">
                  <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full" alt="User" />
                  <span className="font-semibold text-sm">{currentUser.username}</span>
                </div>
                
                <textarea 
                  className="bg-transparent w-full p-4 text-sm resize-none focus:outline-none h-40" 
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                
                <div className="px-4 pb-4 border-b border-zinc-800">
                  <button 
                    onClick={handleGenerateCaption}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-purple-400 px-3 py-2 rounded-full transition-colors w-fit"
                  >
                    <Icons.AI className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Thinking...' : 'Write with Gemini'}</span>
                  </button>
                </div>

                <div className="p-4 text-zinc-500 text-sm flex-1">
                   <div className="flex justify-between py-3 cursor-pointer hover:text-zinc-300">
                     <span>Add Location</span>
                     <Icons.MapPin className="w-4 h-4" />
                   </div>
                   <div className="flex justify-between py-3 cursor-pointer hover:text-zinc-300">
                     <span>Accessibility</span>
                     <Icons.ChevronDown className="w-4 h-4" />
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};