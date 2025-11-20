import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';
import { Link } from 'react-router-dom';
import { EditProfileModal } from '../components/EditProfileModal';

const CreatorInsightsModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-zinc-900 rounded-xl w-full max-w-4xl p-8 border border-zinc-800 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Icons.BarChart className="text-blue-400"/> Professional Dashboard</h2>
                    <button onClick={onClose}><Icons.Close/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-black p-6 rounded-xl border border-zinc-800">
                        <div className="text-zinc-400 text-sm mb-1">Accounts Reached</div>
                        <div className="text-3xl font-bold">12.5k <span className="text-green-500 text-sm ml-2">+14%</span></div>
                    </div>
                    <div className="bg-black p-6 rounded-xl border border-zinc-800">
                        <div className="text-zinc-400 text-sm mb-1">Accounts Engaged</div>
                        <div className="text-3xl font-bold">3.2k <span className="text-green-500 text-sm ml-2">+5%</span></div>
                    </div>
                    <div className="bg-black p-6 rounded-xl border border-zinc-800">
                        <div className="text-zinc-400 text-sm mb-1">Total Followers</div>
                        <div className="text-3xl font-bold">1,205 <span className="text-green-500 text-sm ml-2">+0.8%</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black p-6 rounded-xl border border-zinc-800">
                        <h3 className="font-bold mb-4">Recent Monetization</h3>
                        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                            <span>Badges</span>
                            <span className="font-mono">$45.00</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                            <span>Affiliate</span>
                            <span className="font-mono">$120.50</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="font-bold text-blue-400">Total Payout</span>
                            <span className="font-bold font-mono">$165.50</span>
                        </div>
                    </div>
                    <div className="bg-black p-6 rounded-xl border border-zinc-800 flex flex-col justify-center items-center text-center">
                        <Icons.AI className="w-12 h-12 text-purple-400 mb-4" />
                        <h3 className="font-bold mb-2">Gemini Creator Coach</h3>
                        <p className="text-zinc-400 text-sm mb-4">Try posting Reels at 6 PM for 20% more engagement based on your audience.</p>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-700">View More Tips</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ProfilePage = () => {
    const { currentUser, posts, logout } = useApp();
    const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged' | 'scheduled'>('posts');
    const [showInsights, setShowInsights] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const myPosts = posts.filter(p => p.userId === currentUser?.id && (!p.scheduledTime || p.scheduledTime <= Date.now()));
    const scheduledPosts = posts.filter(p => p.userId === currentUser?.id && p.scheduledTime && p.scheduledTime > Date.now());
    
    const displayPosts = activeTab === 'scheduled' ? scheduledPosts : myPosts;

    if (!currentUser) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                <div className="relative group">
                    <img src={currentUser.avatarUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-zinc-800 object-cover" alt="Profile" />
                    <div className="absolute inset-0 rounded-full bg-black/20 hidden group-hover:flex items-center justify-center cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
                         <Icons.Camera className="w-8 h-8 text-white/80"/>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h2 className="text-xl font-light text-center md:text-left flex items-center">
                            {currentUser.username}
                            {currentUser.isAdmin && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded ml-2 font-bold border border-blue-500/30">ADMIN</span>}
                        </h2>
                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={() => setIsEditProfileOpen(true)}
                                className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700"
                            >
                                Edit profile
                            </button>
                            <button 
                                onClick={() => setShowInsights(true)}
                                className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700 flex items-center gap-1"
                            >
                                Insights <Icons.BarChart className="w-3 h-3"/>
                            </button>
                            <button onClick={logout} className="bg-zinc-800 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700 text-red-400" title="Logout"><Icons.LogOut className="w-5 h-5" /></button>
                        </div>
                        <Icons.Settings className="w-6 h-6 hidden md:block cursor-pointer" />
                    </div>
                    <div className="flex gap-8 mb-4 text-sm md:text-base justify-center md:justify-start">
                        <div><span className="font-semibold">{myPosts.length}</span> posts</div>
                        <div><span className="font-semibold">{currentUser.followers}</span> followers</div>
                        <div><span className="font-semibold">{currentUser.following}</span> following</div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold">{currentUser.fullName}</h3>
                        <p className="text-sm whitespace-pre-line">{currentUser.bio}</p>
                        {currentUser.links && currentUser.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                                {currentUser.links.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-100 bg-blue-900/30 px-2 py-0.5 rounded-md hover:bg-blue-900/50 transition-colors flex items-center">
                                        <Icons.Globe className="w-3 h-3 mr-1" /> {link.title}
                                    </a>
                                ))}
                            </div>
                        )}
                        <a href="#" className="text-sm text-zinc-400 font-semibold flex items-center justify-center md:justify-start mt-2"><Icons.AI className="w-3 h-3 mr-1"/> Created with Gemini</a>
                    </div>
                </div>
            </header>

            {/* Highlights */}
            <div className="mb-12 flex space-x-6 overflow-x-auto pb-4 hide-scrollbar justify-center md:justify-start">
                {currentUser.highlights?.map(highlight => (
                    <div key={highlight.id} className="flex flex-col items-center space-y-2 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-zinc-800 p-1 group-hover:bg-zinc-800 transition-colors">
                            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                                <img src={highlight.coverUrl} className="w-full h-full object-cover" alt={highlight.title} />
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-center">{highlight.title}</span>
                    </div>
                ))}
                {/* Add New Highlight */}
                <div className="flex flex-col items-center space-y-2 cursor-pointer group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-zinc-800 p-1 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900">
                            <Icons.Create className="w-6 h-6 text-zinc-400" />
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-center text-zinc-500">New</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-zinc-800 flex justify-center gap-12 text-xs font-semibold tracking-widest text-zinc-500 mb-4">
                <div 
                    onClick={() => setActiveTab('posts')}
                    className={`py-3 flex items-center gap-2 cursor-pointer ${activeTab === 'posts' ? 'border-t border-white text-white' : 'hover:text-white'}`}
                >
                    <Icons.Home className="w-3 h-3"/> POSTS
                </div>
                <div 
                    onClick={() => setActiveTab('saved')}
                    className={`py-3 flex items-center gap-2 cursor-pointer ${activeTab === 'saved' ? 'border-t border-white text-white' : 'hover:text-white'}`}
                >
                    <Icons.Save className="w-3 h-3"/> SAVED
                </div>
                <div 
                    onClick={() => setActiveTab('tagged')}
                    className={`py-3 flex items-center gap-2 cursor-pointer ${activeTab === 'tagged' ? 'border-t border-white text-white' : 'hover:text-white'}`}
                >
                    <Icons.Profile className="w-3 h-3"/> TAGGED
                </div>
                <div 
                    onClick={() => setActiveTab('scheduled')}
                    className={`py-3 flex items-center gap-2 cursor-pointer ${activeTab === 'scheduled' ? 'border-t border-white text-white' : 'hover:text-white'}`}
                >
                    <Icons.Calendar className="w-3 h-3"/> SCHEDULED
                </div>
            </div>

            {/* Grid */}
            {displayPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                    {displayPosts.map(post => (
                        <div key={post.id} className="aspect-square relative group cursor-pointer bg-zinc-900">
                            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post" />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white font-bold transition-opacity">
                                <span className="flex items-center"><Icons.Activity className="fill-white w-5 h-5 mr-2"/> {post.likes.length}</span>
                                <span className="flex items-center"><Icons.Message className="fill-white w-5 h-5 mr-2"/> {post.comments.length}</span>
                            </div>

                            {/* Icons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                {post.music && <Icons.Music className="w-4 h-4 text-white shadow-lg drop-shadow-md" />}
                                {post.scheduledTime && post.scheduledTime > Date.now() && <Icons.Clock className="w-4 h-4 text-white shadow-lg drop-shadow-md" />}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                    <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-4">
                        <Icons.Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">No Posts Yet</h3>
                    {activeTab === 'scheduled' && <p className="mt-2">Schedule posts from the upload menu.</p>}
                </div>
            )}
            
            {showInsights && <CreatorInsightsModal onClose={() => setShowInsights(false)} />}
            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
        </div>
    )
};