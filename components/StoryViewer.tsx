import React, { useEffect, useState } from 'react';
import { Story, User } from '../types';
import { Icons } from './Icons';

interface StoryViewerProps {
  stories: Story[];
  user: User;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, user, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 1; // 100 steps in ~5 seconds
      });
    }, 50); // 5 seconds per story

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, onClose]);

  // Reset progress when index changes manualy
  useEffect(() => {
      setProgress(0);
  }, [currentIndex]);

  const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex < stories.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          onClose();
      }
  };

  const handlePrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
      }
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Desktop background blur */}
        <div className="absolute inset-0 hidden md:block">
             <img src={currentStory.imageUrl} className="w-full h-full object-cover blur-2xl opacity-50" />
        </div>

        <div className="relative w-full md:w-[400px] h-full md:h-[85vh] bg-black md:rounded-xl overflow-hidden flex flex-col">
             {/* Progress Bars */}
             <div className="absolute top-0 left-0 right-0 z-20 flex space-x-1 p-2">
                 {stories.map((_, idx) => (
                     <div key={idx} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                         <div 
                            className={`h-full bg-white transition-all duration-100 ease-linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? '' : 'w-0'}`}
                            style={{ width: idx === currentIndex ? `${progress}%` : undefined }}
                         />
                     </div>
                 ))}
             </div>

             {/* Header */}
             <div className="absolute top-4 left-0 right-0 z-20 p-4 flex items-center justify-between text-white mt-2">
                 <div className="flex items-center">
                     <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-white/20 mr-2" />
                     <span className="font-semibold text-sm text-shadow">{user.username}</span>
                     <span className="text-white/60 text-xs ml-2">{new Date(currentStory.timestamp).getHours()}h</span>
                 </div>
                 <div className="flex items-center space-x-4">
                     <Icons.More className="w-5 h-5" />
                     <button onClick={onClose}><Icons.Close className="w-6 h-6" /></button>
                 </div>
             </div>

             {/* Image */}
             <div className="flex-1 relative bg-zinc-900" onClick={handleNext}>
                 <img src={currentStory.imageUrl} className="w-full h-full object-cover" />
                 
                 {/* Navigation Tap Areas */}
                 <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev}></div>
             </div>

             {/* Footer */}
             <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-4">
                 <input 
                    type="text" 
                    placeholder={`Send message to ${user.username}...`}
                    className="bg-transparent border border-white/40 rounded-full px-4 py-2.5 text-white placeholder-white/70 flex-1 text-sm focus:outline-none backdrop-blur-sm"
                 />
                 <Icons.Activity className="w-7 h-7 text-white" />
                 <Icons.Send className="w-7 h-7 text-white" />
             </div>
        </div>
    </div>
  );
};