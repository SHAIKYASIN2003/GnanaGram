import React from 'react';
import { Icons } from '../components/Icons';

export const Reels = () => {
  // Mock reels data
  const reels = [1, 2, 3]; 

  return (
    <div className="h-full w-full flex justify-center overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
      <div className="w-full max-w-md h-full space-y-4 py-4">
        {reels.map((reel) => (
            <div key={reel} className="w-full h-[85vh] bg-zinc-900 rounded-lg relative snap-center shrink-0 border border-zinc-800 overflow-hidden group">
                <img 
                    src={`https://picsum.photos/seed/reel${reel}/400/800`} 
                    alt="Reel" 
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex-1 mb-4">
                         <div className="flex items-center mb-2">
                            <img src="https://picsum.photos/30" className="w-8 h-8 rounded-full mr-2" />
                            <span className="font-semibold text-sm">creator_name</span>
                            <button className="ml-2 border border-white/50 text-xs px-2 py-1 rounded">Follow</button>
                         </div>
                         <p className="text-sm mb-2">Wait for the drop! 🎵 #music #dance</p>
                         <div className="flex items-center text-xs">
                            <Icons.Music className="w-3 h-3 mr-1" /> Original Audio
                         </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 mb-4 ml-4">
                        <div className="flex flex-col items-center space-y-1">
                            <Icons.Activity className="w-7 h-7" />
                            <span className="text-xs">12k</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <Icons.Message className="w-7 h-7" />
                            <span className="text-xs">405</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <Icons.Send className="w-7 h-7" />
                        </div>
                        <Icons.More className="w-6 h-6" />
                        <div className="w-8 h-8 border-2 border-white rounded-lg overflow-hidden">
                             <img src="https://picsum.photos/30" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <Icons.Camera className="w-6 h-6" />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
