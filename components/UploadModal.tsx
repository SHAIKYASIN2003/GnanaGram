import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { useApp } from '../store/AppContext';
import { generateImageCaption, moderateContent, moderateImage } from '../services/geminiService';
import { Post, AudioTrack, ProductTag } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MUSIC_LIBRARY: AudioTrack[] = [
    { id: 'm1', title: 'Summer Vibe', artist: 'The Weeknd', coverUrl: 'https://picsum.photos/seed/m1/100', duration: '0:30' },
    { id: 'm2', title: 'Chill Lofi', artist: 'Dreamer', coverUrl: 'https://picsum.photos/seed/m2/100', duration: '0:45' },
    { id: 'm3', title: 'High Energy', artist: 'Techno King', coverUrl: 'https://picsum.photos/seed/m3/100', duration: '0:25' },
    { id: 'm4', title: 'Acoustic', artist: 'Guitar Guy', coverUrl: 'https://picsum.photos/seed/m4/100', duration: '1:00' },
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users, addPost } = useApp();
  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<AudioTrack | null>(null);
  const [showMusicLibrary, setShowMusicLibrary] = useState(false);
  
  // New Feature States
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCoAuthor, setSelectedCoAuthor] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep('edit');
      setError(null);
      setSelectedMusic(null);
    }
  };

  const handleGenerateCaption = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    setError(null);
    
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      const generated = await generateImageCaption(base64Content, caption);
      setCaption(generated);
      setIsGenerating(false);
    };
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    setIsGenerating(true); // Re-use loading state
    setError(null);

    // 1. Moderate Text
    const isOffensive = await moderateContent(caption);
    if (isOffensive) {
        setError("Your caption contains inappropriate content.");
        setIsGenerating(false);
        return;
    }

    // 2. Moderate Image
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(',')[1];
        
        const imageSafety = await moderateImage(base64Content);

        if (!imageSafety.safe) {
            setError(`Upload blocked by AI: ${imageSafety.reason || "Unsafe content detected."}`);
            setIsGenerating(false);
            return;
        }

        // If safe, proceed
        const products: ProductTag[] = (productName && productPrice) 
            ? [{ id: Date.now().toString(), name: productName, price: productPrice }] 
            : [];

        const newPost: Post = {
          id: Date.now().toString(),
          userId: currentUser.id,
          imageUrl: previewUrl,
          caption: caption,
          likes: [],
          comments: [],
          timestamp: scheduledTime ? new Date(scheduledTime).getTime() : Date.now(),
          aspectRatio: 1,
          location: 'Unknown Location',
          music: selectedMusic || undefined,
          coAuthors: selectedCoAuthor ? [selectedCoAuthor] : undefined,
          scheduledTime: scheduledTime ? new Date(scheduledTime).getTime() : undefined,
          productTags: products
        };
        
        addPost(newPost);
        handleClose();
        setIsGenerating(false);
    };
  };

  const handleClose = () => {
    setStep('select');
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    setError(null);
    setSelectedMusic(null);
    setShowMusicLibrary(false);
    setShowAdvanced(false);
    setSelectedCoAuthor('');
    setScheduledTime('');
    setProductName('');
    setProductPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-3xl h-[700px] flex flex-col overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
          {step === 'edit' ? (
             <button onClick={() => setStep('select')}><Icons.Back className="w-6 h-6" /></button>
          ) : (
             <button onClick={handleClose}><Icons.Close className="w-6 h-6" /></button>
          )}
          <span className="font-semibold">Create new post</span>
          {step === 'edit' ? (
            <button 
                onClick={handleShare} 
                disabled={isGenerating}
                className="text-blue-500 font-bold text-sm hover:text-blue-400 disabled:opacity-50"
            >
                {isGenerating ? 'Sharing...' : (scheduledTime ? 'Schedule' : 'Share')}
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row bg-black overflow-hidden">
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
              <div className="flex-1 bg-black flex items-center justify-center border-r border-zinc-800 relative">
                 <img src={previewUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
                 
                 {/* Music Badge on Preview */}
                 {selectedMusic && (
                     <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs border border-white/10 animate-in fade-in">
                         <Icons.Music className="w-3 h-3" />
                         <span>{selectedMusic.title} • {selectedMusic.artist}</span>
                         <button onClick={() => setSelectedMusic(null)}><Icons.Close className="w-3 h-3 ml-1"/></button>
                     </div>
                 )}
                 
                 {productName && (
                    <div className="absolute top-4 right-4 bg-white text-black px-2 py-1 text-xs font-bold rounded shadow-lg flex items-center">
                        <Icons.ShoppingBag className="w-3 h-3 mr-1"/> {productName} - {productPrice}
                    </div>
                 )}
              </div>
              
              {/* Editor Sidebar */}
              <div className="w-full md:w-80 flex flex-col bg-zinc-900 border-l border-zinc-800 relative overflow-y-auto">
                {/* Music Library Overlay */}
                {showMusicLibrary && (
                    <div className="absolute inset-0 z-20 bg-zinc-900 animate-in slide-in-from-right duration-200 flex flex-col">
                        <div className="flex items-center p-4 border-b border-zinc-800">
                            <button onClick={() => setShowMusicLibrary(false)}><Icons.Back className="w-6 h-6 mr-2" /></button>
                            <span className="font-bold">Music Library</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="px-2 pb-2 text-xs text-zinc-500 font-semibold">RECOMMENDED FOR YOU</div>
                            {MUSIC_LIBRARY.map(track => (
                                <div 
                                    key={track.id} 
                                    onClick={() => { setSelectedMusic(track); setShowMusicLibrary(false); }}
                                    className="flex items-center p-2 hover:bg-zinc-800 rounded-lg cursor-pointer"
                                >
                                    <img src={track.coverUrl} className="w-10 h-10 rounded mr-3" alt={track.title} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm">{track.title}</div>
                                        <div className="text-xs text-zinc-400">{track.artist}</div>
                                    </div>
                                    <div className="text-xs text-zinc-500">{track.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 flex items-center space-x-3 border-b border-zinc-800">
                  <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full" alt="User" />
                  <span className="font-semibold text-sm">{currentUser.username}</span>
                </div>
                
                <textarea 
                  className="bg-transparent w-full p-4 text-sm resize-none focus:outline-none h-32" 
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />

                {error && (
                    <div className="px-4 pb-2 text-red-500 text-xs bg-red-500/10 py-2 mx-4 rounded mb-2 border border-red-500/20">
                        <strong className="block mb-1">Safety Alert</strong>
                        {error}
                    </div>
                )}
                
                <div className="px-4 pb-4 border-b border-zinc-800">
                  <button 
                    onClick={handleGenerateCaption}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-purple-400 px-3 py-2 rounded-full transition-colors w-fit"
                  >
                    <Icons.AI className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Checking content...' : 'Write with Gemini'}</span>
                  </button>
                </div>

                <div className="p-4 text-zinc-500 text-sm flex-1">
                   <div className="flex justify-between py-3 cursor-pointer hover:text-zinc-300">
                     <span>Add Location</span>
                     <Icons.MapPin className="w-4 h-4" />
                   </div>
                   <div 
                     className="flex justify-between py-3 cursor-pointer hover:text-zinc-300"
                     onClick={() => setShowMusicLibrary(true)}
                   >
                     <span>Add Music</span>
                     <div className="flex items-center">
                        <span className="text-xs text-zinc-400 mr-2">{selectedMusic ? 'Selected' : ''}</span>
                        <Icons.Music className={`w-4 h-4 ${selectedMusic ? 'text-blue-400' : ''}`} />
                     </div>
                   </div>
                   
                   {/* Advanced Features Toggle */}
                   <div 
                     className="flex justify-between py-3 cursor-pointer hover:text-zinc-300 border-t border-zinc-800 mt-2"
                     onClick={() => setShowAdvanced(!showAdvanced)}
                   >
                     <span className="font-semibold text-white">Advanced Settings</span>
                     <Icons.ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                   </div>

                   {showAdvanced && (
                       <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                           {/* Schedule */}
                           <div>
                               <label className="block text-xs text-zinc-400 mb-1 flex items-center gap-1"><Icons.Calendar className="w-3 h-3"/> Schedule Post</label>
                               <input 
                                type="datetime-local" 
                                className="w-full bg-zinc-800 rounded p-2 text-white text-xs focus:outline-none"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                               />
                           </div>

                           {/* Collaborator */}
                           <div>
                               <label className="block text-xs text-zinc-400 mb-1 flex items-center gap-1"><Icons.Users className="w-3 h-3"/> Tag Collaborator</label>
                               <select 
                                className="w-full bg-zinc-800 rounded p-2 text-white text-xs focus:outline-none"
                                value={selectedCoAuthor}
                                onChange={(e) => setSelectedCoAuthor(e.target.value)}
                               >
                                   <option value="">None</option>
                                   {users.filter(u => u.id !== currentUser.id).map(u => (
                                       <option key={u.id} value={u.id}>{u.username}</option>
                                   ))}
                               </select>
                           </div>

                           {/* Products */}
                           <div>
                               <label className="block text-xs text-zinc-400 mb-1 flex items-center gap-1"><Icons.ShoppingBag className="w-3 h-3"/> Tag Product</label>
                               <div className="flex gap-2">
                                   <input 
                                    type="text" 
                                    placeholder="Item Name"
                                    className="flex-1 bg-zinc-800 rounded p-2 text-white text-xs focus:outline-none"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                   />
                                   <input 
                                    type="text" 
                                    placeholder="Price"
                                    className="w-20 bg-zinc-800 rounded p-2 text-white text-xs focus:outline-none"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                   />
                               </div>
                           </div>
                       </div>
                   )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};