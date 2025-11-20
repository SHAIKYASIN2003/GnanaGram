import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from './Icons';
import { User } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<User>>({
      username: currentUser?.username,
      fullName: currentUser?.fullName,
      bio: currentUser?.bio,
      avatarUrl: currentUser?.avatarUrl,
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      links: currentUser?.links || [],
      isPrivate: currentUser?.isPrivate || false,
  });

  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleChange = (field: keyof User, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setFormData(prev => ({ ...prev, avatarUrl: url }));
      }
  };

  const handleAddLink = () => {
      if(newLinkTitle && newLinkUrl) {
          const updatedLinks = [...(formData.links || []), { title: newLinkTitle, url: newLinkUrl }];
          setFormData(prev => ({ ...prev, links: updatedLinks }));
          setNewLinkTitle('');
          setNewLinkUrl('');
      }
  };

  const removeLink = (index: number) => {
      const updatedLinks = [...(formData.links || [])];
      updatedLinks.splice(index, 1);
      setFormData(prev => ({ ...prev, links: updatedLinks }));
  };

  const handleSave = () => {
      updateUser({
          ...currentUser,
          ...formData as User
      });
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-zinc-800 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
         {/* Header */}
         <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
             <h2 className="text-lg font-bold">Edit Profile</h2>
             <button onClick={onClose}><Icons.Close className="w-6 h-6" /></button>
         </div>

         {/* Body */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
             
             {/* Avatar */}
             <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-xl">
                 <div className="flex items-center">
                     <img src={formData.avatarUrl} className="w-16 h-16 rounded-full object-cover border border-zinc-700 mr-4" alt="Avatar" />
                     <div>
                         <div className="font-semibold text-lg">{currentUser.username}</div>
                         <div className="text-zinc-400 text-sm">{currentUser.fullName}</div>
                     </div>
                 </div>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                 >
                     Change photo
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
             </div>

             {/* Main Info */}
             <div className="space-y-4">
                 <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Name</label>
                     <input 
                        type="text" 
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                     />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Username</label>
                     <input 
                        type="text" 
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                     />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Bio</label>
                     <textarea 
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors h-24 resize-none"
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                     />
                 </div>
             </div>

             <div className="border-t border-zinc-800 pt-4 space-y-4">
                 <h3 className="font-bold text-white">Links</h3>
                 {formData.links && formData.links.length > 0 && (
                     <div className="space-y-2">
                         {formData.links.map((link, i) => (
                             <div key={i} className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
                                 <div className="flex flex-col overflow-hidden">
                                     <span className="font-semibold text-sm">{link.title}</span>
                                     <span className="text-xs text-blue-400 truncate">{link.url}</span>
                                 </div>
                                 <button onClick={() => removeLink(i)} className="text-zinc-500 hover:text-red-500"><Icons.Close className="w-4 h-4"/></button>
                             </div>
                         ))}
                     </div>
                 )}
                 <div className="flex gap-2">
                     <input 
                        placeholder="Title (e.g. Portfolio)" 
                        className="bg-black border border-zinc-800 rounded-lg p-2 text-sm flex-1 focus:outline-none text-white"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                     />
                     <input 
                        placeholder="URL" 
                        className="bg-black border border-zinc-800 rounded-lg p-2 text-sm flex-[2] focus:outline-none text-white"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                     />
                     <button 
                        onClick={handleAddLink}
                        className="bg-zinc-800 px-3 rounded-lg font-bold text-white hover:bg-zinc-700"
                     >
                         +
                     </button>
                 </div>
             </div>

             {/* Private Info */}
             <div className="border-t border-zinc-800 pt-4 space-y-4">
                 <h3 className="font-bold text-white">Personal Information</h3>
                 <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Email</label>
                     <input 
                        type="email" 
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                     />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Phone</label>
                     <input 
                        type="tel" 
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                     />
                 </div>
             </div>
             
             {/* Settings */}
             <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
                 <div>
                     <div className="font-bold text-white">Private Account</div>
                     <div className="text-xs text-zinc-500">Only people you approve can see your photos and videos.</div>
                 </div>
                 <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.isPrivate ? 'bg-blue-600' : 'bg-zinc-700'}`}
                    onClick={() => handleChange('isPrivate', !formData.isPrivate)}
                 >
                     <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.isPrivate ? 'translate-x-6' : ''}`} />
                 </div>
             </div>
         </div>

         {/* Footer */}
         <div className="p-6 border-t border-zinc-800 bg-zinc-900 shrink-0 flex justify-end">
             <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
             >
                 Save Changes
             </button>
         </div>
      </div>
    </div>
  );
};