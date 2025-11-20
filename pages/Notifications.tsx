import React from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';

export const Notifications = () => {
    const { notifications, users } = useApp();

    // Group notifications (simple grouping for today/this week mock)
    const today = notifications;
    
    return (
        <div className="w-full max-w-2xl mx-auto pt-8 px-4">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            
            <div className="mb-4">
                <h3 className="text-lg font-bold mb-4">Today</h3>
                {today.length === 0 ? (
                    <div className="text-zinc-500">No new notifications.</div>
                ) : (
                    <div className="flex flex-col space-y-4">
                        {today.map(notif => {
                            const user = users.find(u => u.id === notif.userId);
                            if (!user) return null;
                            
                            return (
                                <div key={notif.id} className="flex items-center justify-between hover:bg-zinc-900 p-2 rounded-lg transition-colors">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <img src={user.avatarUrl} className="w-12 h-12 rounded-full mr-3" alt={user.username} />
                                            {notif.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-black"><Icons.Activity className="w-3 h-3 fill-white text-white" /></div>}
                                            {notif.type === 'comment' && <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-black"><Icons.Message className="w-3 h-3 fill-white text-white" /></div>}
                                            {notif.type === 'follow' && <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1 border-2 border-black"><Icons.Profile className="w-3 h-3 fill-white text-white" /></div>}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold mr-1">{user.username}</span>
                                            <span className="text-zinc-300">
                                                {notif.type === 'like' && 'liked your post.'}
                                                {notif.type === 'comment' && 'commented on your post.'}
                                                {notif.type === 'follow' && 'started following you.'}
                                            </span>
                                            <div className="text-zinc-500 text-xs mt-1">2h</div>
                                        </div>
                                    </div>
                                    {notif.type === 'follow' ? (
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Follow Back</button>
                                    ) : notif.postId ? (
                                        <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden">
                                             {/* Placeholder for post thumb */}
                                             <img src={`https://picsum.photos/seed/${notif.postId}/100/100`} className="w-full h-full object-cover" />
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div className="border-t border-zinc-800 my-4 pt-4">
                <h3 className="text-lg font-bold mb-4">This Week</h3>
                <div className="flex items-center py-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                        <Icons.Activity className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">Follow requests</p>
                        <p className="text-xs text-zinc-500">Approve or ignore requests</p>
                    </div>
                </div>
            </div>
        </div>
    );
};