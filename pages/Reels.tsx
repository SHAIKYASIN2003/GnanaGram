import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';

interface ReelData {
    id: number;
    url: string;
    username: string;
    description: string;
    likes: string;
    comments: string;
    song: string;
    avatar: string;
}

const REELS_DATA: ReelData[] = [
    {
        id: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        username: "travel_beat",
        avatar: "https://picsum.photos/seed/travel_beat/100",
        description: "Living for these moments 🌄 #travel #nature",
        likes: "125k",
        comments: "854",
        song: "Original Audio"
    },
    {
        id: 2,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        username: "tech_insider",
        avatar: "https://picsum.photos/seed/tech/100",
        description: "Smooth graphics only 🎮 #gaming #setup",
        likes: "120k",
        comments: "5k",
        song: "Synthwave Mix"
    },
    {
        id: 3,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        username: "nature_lover",
        avatar: "https://picsum.photos/seed/nature/100",
        description: "Escape the ordinary 🌿",
        likes: "89k",
        comments: "900",
        song: "Nature Sounds"
    },
    {
        id: 4,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        username: "cinema_club",
        avatar: "https://picsum.photos/seed/cinema/100",
        description: "What a scene! 🎬 #movies",
        likes: "200k",
        comments: "3.4k",
        song: "Movie Score"
    }
];

export const Reels = () => {
  const [activeReelId, setActiveReelId] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<number[]>([]);
  const [savedReels, setSavedReels] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // Observer for scrolling
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6, // Video must be 60% visible to be active
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute('data-id'));
          setActiveReelId(id);
        }
      });
    }, options);

    const elements = containerRef.current?.querySelectorAll('.reel-item');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle Auto Play/Pause based on active ID
  useEffect(() => {
      videoRefs.current.forEach((video, id) => {
          if (id === activeReelId) {
              if (isPlaying) {
                  video.play().catch(() => {}); // Auto-play might fail if not muted
              } else {
                  video.pause();
              }
          } else {
              video.pause();
              video.currentTime = 0; // Reset other videos
          }
      });
  }, [activeReelId, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPlaying(!isPlaying);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 600);
  };

  const toggleLike = (id: number) => {
      setLikedReels(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSave = (id: number) => {
      setSavedReels(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div 
        ref={containerRef}
        className="h-full w-full flex justify-center overflow-y-scroll snap-y snap-mandatory hide-scrollbar bg-black"
    >
      <div className="w-full max-w-[450px] h-full">
        {REELS_DATA.map((reel) => (
            <div 
                key={reel.id} 
                data-id={reel.id}
                className="reel-item w-full h-[calc(100vh-50px)] md:h-[calc(100vh-40px)] bg-zinc-900 relative snap-center shrink-0 overflow-hidden border-b border-zinc-800/20"
            >
                {/* Video Player */}
                <video 
                    ref={el => { if (el) videoRefs.current.set(reel.id, el); }}
                    src={reel.url} 
                    className="w-full h-full object-cover cursor-pointer"
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onClick={togglePlay}
                />
                
                {/* Play/Pause Overlay Animation */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showPlayIcon ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-black/40 p-6 rounded-full backdrop-blur-sm">
                        {isPlaying ? <Icons.Video className="w-12 h-12 text-white fill-white" /> : <Icons.Music className="w-12 h-12 text-white fill-white" />} 
                        {/* Using Music/Video icons as placeholders for Play/Pause if standard ones aren't in the generic Icon set provided. 
                            Ideally would use Play/Pause icons. Assuming Video is play-like. */}
                    </div>
                </div>

                {/* Top Right Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                    <button onClick={() => setIsMuted(!isMuted)} className="bg-black/20 backdrop-blur-md p-2 rounded-full">
                       {isMuted ? <Icons.Music className="w-5 h-5 text-white/50" /> : <Icons.Music className="w-5 h-5 text-white animate-pulse" />}
                    </button>
                    <Icons.Camera className="w-7 h-7 text-white drop-shadow-lg cursor-pointer" />
                </div>

                {/* Bottom Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
                    <div className="flex flex-row items-end pb-10 md:pb-2">
                        {/* Left Content (User info) */}
                        <div className="flex-1 pointer-events-auto pr-4">
                             <div className="flex items-center mb-3">
                                <div className="w-9 h-9 rounded-full bg-zinc-700 mr-3 overflow-hidden border border-white/20 cursor-pointer hover:scale-105 transition-transform">
                                    <img src={reel.avatar} className="w-full h-full object-cover" alt={reel.username} />
                                </div>
                                <span className="font-semibold text-sm text-white mr-3 text-shadow cursor-pointer hover:underline">{reel.username}</span>
                                <button className="border border-white/70 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-md hover:bg-white/20 transition font-semibold">Follow</button>
                             </div>
                             <p className="text-sm mb-3 text-white text-shadow-sm line-clamp-2">{reel.description}</p>
                             <div className="flex items-center text-xs text-white/90 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md cursor-pointer">
                                <Icons.Music className="w-3 h-3 mr-2" /> 
                                <div className="overflow-hidden max-w-[150px] relative">
                                     <span className="whitespace-nowrap animate-marquee">{reel.song} • Original Audio</span>
                                </div>
                             </div>
                        </div>
                        
                        {/* Right Sidebar Actions */}
                        <div className="flex flex-col items-center space-y-5 pointer-events-auto min-w-[50px]">
                            <div className="flex flex-col items-center space-y-1 group cursor-pointer" onClick={() => toggleLike(reel.id)}>
                                <Icons.Activity className={`w-7 h-7 transition-transform active:scale-75 drop-shadow-md ${likedReels.includes(reel.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                <span className="text-xs text-white font-medium">{likedReels.includes(reel.id) ? parseInt(reel.likes) + 1 + 'k' : reel.likes}</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1 cursor-pointer group">
                                <Icons.Message className="w-7 h-7 text-white transition-transform active:scale-75 drop-shadow-md" />
                                <span className="text-xs text-white font-medium">{reel.comments}</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1 cursor-pointer group">
                                <Icons.Send className="w-7 h-7 text-white -rotate-12 transition-transform active:scale-75 drop-shadow-md" />
                            </div>
                            <div className="cursor-pointer" onClick={() => toggleSave(reel.id)}>
                                <Icons.Save className={`w-7 h-7 drop-shadow-md transition-colors ${savedReels.includes(reel.id) ? 'text-white fill-white' : 'text-white'}`} />
                            </div>
                            <Icons.More className="w-6 h-6 text-white cursor-pointer drop-shadow-md mt-2" />
                            <div className={`w-8 h-8 border-2 border-white/80 rounded-lg overflow-hidden cursor-pointer ${isPlaying ? 'animate-spin-slow' : ''} mt-2`}>
                                 <img src={`https://picsum.photos/seed/${reel.song}/100`} className="w-full h-full object-cover" alt="audio" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
      <style>{`
        .text-shadow { text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
        .text-shadow-sm { text-shadow: 0 1px 1px rgba(0,0,0,0.5); }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-marquee { animation: marquee 5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
      `}</style>
    </div>
  );
};