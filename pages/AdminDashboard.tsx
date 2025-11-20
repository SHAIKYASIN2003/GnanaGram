import React from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';

export const AdminDashboard = () => {
    const { currentUser, posts, users, deletePost } = useApp();

    if (!currentUser?.isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-zinc-500">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                    <div className="bg-zinc-900 p-4 rounded-lg min-w-[150px] border border-zinc-800">
                        <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Users</div>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-lg min-w-[150px] border border-zinc-800">
                        <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Posts</div>
                        <div className="text-2xl font-bold">{posts.length}</div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-lg min-w-[150px] border border-zinc-800 border-l-4 border-l-red-500">
                        <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">AI Flags</div>
                        <div className="text-2xl font-bold text-red-400">0</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Moderation Queue (Simulated) */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center">
                            <Icons.Activity className="w-5 h-5 mr-2 text-red-500" />
                            Moderation Queue
                        </h2>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">AI Active</span>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-black rounded-lg border border-zinc-800 text-center text-zinc-500 text-sm">
                            <Icons.AI className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            All recent uploads have passed AI safety checks.
                        </div>
                    </div>
                </div>

                {/* Recent Content Management */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h2 className="text-xl font-bold mb-6">Recent Posts</h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {posts.map(post => {
                            const author = users.find(u => u.id === post.userId);
                            return (
                                <div key={post.id} className="flex items-start p-3 bg-black rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <img src={post.imageUrl} className="w-16 h-16 object-cover rounded bg-zinc-800 mr-4" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-sm">{author?.username}</span>
                                            <span className="text-xs text-zinc-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 truncate mt-1">{post.caption}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                                                Likes: {post.likes.length}
                                            </span>
                                            {post.music && (
                                                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 flex items-center">
                                                    <Icons.Music className="w-3 h-3 mr-1" /> Music
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if(confirm('Admin Delete: Are you sure?')) deletePost(post.id);
                                        }}
                                        className="ml-4 text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"
                                        title="Delete Post"
                                    >
                                        <Icons.Close className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};