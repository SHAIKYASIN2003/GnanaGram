import React from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';

export const ProfilePage = () => {
    const { currentUser, posts, logout } = useApp();
    const myPosts = posts.filter(p => p.userId === currentUser?.id);

    if (!currentUser) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <img src={currentUser.avatarUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-zinc-800" alt="Profile" />
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h2 className="text-xl font-light text-center md:text-left">{currentUser.username}</h2>
                        <div className="flex gap-2 justify-center">
                            <button className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700">Edit profile</button>
                            <button className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700">View Archive</button>
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
                        <a href="#" className="text-sm text-blue-200 font-semibold flex items-center justify-center md:justify-start mt-1"><Icons.AI className="w-3 h-3 mr-1"/> Created with Gemini</a>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-t border-zinc-800 flex justify-center gap-12 text-xs font-semibold tracking-widest text-zinc-500 mb-4">
                <div className="border-t border-white text-white py-3 flex items-center gap-2 cursor-pointer"><Icons.Home className="w-3 h-3"/> POSTS</div>
                <div className="py-3 flex items-center gap-2 cursor-pointer hover:text-white"><Icons.Save className="w-3 h-3"/> SAVED</div>
                <div className="py-3 flex items-center gap-2 cursor-pointer hover:text-white"><Icons.Profile className="w-3 h-3"/> TAGGED</div>
            </div>

            {/* Grid */}
            {myPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                    {myPosts.map(post => (
                        <div key={post.id} className="aspect-square relative group cursor-pointer bg-zinc-900">
                            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white font-bold">
                                <span className="flex items-center"><Icons.Activity className="fill-white w-5 h-5 mr-2"/> {post.likes.length}</span>
                                <span className="flex items-center"><Icons.Message className="fill-white w-5 h-5 mr-2"/> {post.comments.length}</span>
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
                </div>
            )}
        </div>
    )
};