import React from 'react';
import { Icons } from '../components/Icons';

export const ExplorePage = () => {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Search Bar */}
            <div className="p-4 sticky top-0 z-10 bg-black/80 backdrop-blur-md">
                <div className="bg-zinc-800 rounded-lg flex items-center px-4 py-2">
                    <Icons.Search className="w-4 h-4 text-zinc-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-transparent focus:outline-none text-white w-full placeholder-zinc-400"
                    />
                </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="px-4 pb-4">
                <div className="flex items-center mb-3">
                    <Icons.AI className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Recommended for you</h3>
                </div>
                <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
                    {['Nature', 'Photography', 'Digital Art', 'Travel', 'Tech'].map((tag, i) => (
                        <div key={i} className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-semibold whitespace-nowrap hover:bg-zinc-800 cursor-pointer transition">
                            #{tag}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-4 pb-10">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className={`relative aspect-square group cursor-pointer ${i % 10 === 2 ? 'row-span-2 col-span-1 h-full' : ''}`}>
                        <img 
                            src={`https://picsum.photos/seed/exp${i}/500/500`} 
                            className="w-full h-full object-cover" 
                            alt="Explore" 
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 text-white font-bold transition-opacity">
                            <div className="flex items-center"><Icons.Activity className="w-6 h-6 mr-1 fill-white" /> {Math.floor(Math.random() * 1000)}</div>
                            <div className="flex items-center"><Icons.Message className="w-6 h-6 mr-1 fill-white" /> {Math.floor(Math.random() * 100)}</div>
                        </div>
                        {/* Type Icon */}
                        <div className="absolute top-2 right-2">
                             {i % 3 === 0 ? <Icons.Reels className="w-5 h-5 text-white drop-shadow-lg" /> : <Icons.Image className="w-5 h-5 text-white drop-shadow-lg" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};