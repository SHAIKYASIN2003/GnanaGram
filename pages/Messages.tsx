import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';
import { getAIChatResponse } from '../services/geminiService';

export const Messages = () => {
  const { users, currentUser, messages, sendMessage } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get unique conversation partners
  const conversationUserIds = Array.from(new Set([
      ...messages.filter(m => m.senderId === currentUser.id).map(m => m.receiverId),
      ...messages.filter(m => m.receiverId === currentUser.id).map(m => m.senderId),
      'ai_bot' // Always show AI bot
  ]));

  const activeUser = users.find(u => u.id === selectedUserId);

  const conversationMessages = selectedUserId 
    ? messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === selectedUserId) || 
        (m.senderId === selectedUserId && m.receiverId === currentUser.id)
      ).sort((a, b) => a.timestamp - b.timestamp)
    : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, selectedUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUserId) return;

    sendMessage(selectedUserId, input);
    const originalInput = input;
    setInput('');

    // Handle AI Bot response
    if (selectedUserId === 'ai_bot') {
        // Format history for Gemini
        const history = conversationMessages.map(m => ({
            role: m.senderId === 'ai_bot' ? 'model' as const : 'user' as const,
            parts: [{ text: m.text }]
        }));
        
        // Add current message to history context locally for the call
        // Note: We already sent the message via sendMessage, so it will appear in UI.
        // We just need to wait for response.
        const response = await getAIChatResponse(history, originalInput);
        sendMessage('ai_bot', response);
    }
  };

  return (
    <div className="flex h-full w-full text-white">
      {/* Sidebar List */}
      <div className={`w-full md:w-96 border-r border-zinc-800 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">
          <div className="flex items-center font-bold text-lg cursor-pointer">
            {currentUser.username} <Icons.Back className="rotate-270 w-4 h-4 ml-2" />
          </div>
          <Icons.Create className="w-6 h-6" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex justify-between items-center">
              <h3 className="font-bold">Messages</h3>
              <span className="text-zinc-500 text-sm font-semibold">Requests</span>
          </div>
          {conversationUserIds.map(id => {
            const user = users.find(u => u.id === id);
            if (!user) return null;
            const lastMsg = messages.filter(m => (m.senderId === id && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === id)).pop();
            
            return (
              <div 
                key={id} 
                onClick={() => setSelectedUserId(id)}
                className={`flex items-center px-5 py-3 hover:bg-zinc-900 cursor-pointer ${selectedUserId === id ? 'bg-zinc-900' : ''}`}
              >
                <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full mr-3" />
                <div className="flex-1">
                   <div className="text-sm font-medium flex items-center">
                       {user.username}
                       {user.isVerified && <Icons.AI className="w-3 h-3 ml-1 text-blue-400" />}
                    </div>
                   <div className="text-xs text-zinc-500 truncate max-w-[200px]">{lastMsg ? lastMsg.text : 'Start a conversation'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
        {activeUser ? (
          <>
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-5">
              <div className="flex items-center">
                <button className="md:hidden mr-4" onClick={() => setSelectedUserId(null)}>
                    <Icons.Back className="w-6 h-6" />
                </button>
                <img src={activeUser.avatarUrl} className="w-8 h-8 rounded-full mr-3" alt="User" />
                <span className="font-semibold">{activeUser.fullName}</span>
              </div>
              <div className="flex space-x-4">
                <Icons.Reels className="w-6 h-6" />
                <Icons.Activity className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {conversationMessages.map(msg => {
                   const isMe = msg.senderId === currentUser.id;
                   return (
                       <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-white'}`}>
                               {msg.text}
                           </div>
                       </div>
                   )
               })}
               <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-zinc-800">
               <form onSubmit={handleSend} className="flex items-center bg-zinc-900 rounded-full px-4 py-2 border border-zinc-800">
                  <Icons.Emoji className="w-6 h-6 text-white mr-3" />
                  <input 
                    className="flex-1 bg-transparent focus:outline-none text-sm" 
                    placeholder="Message..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {input.trim() ? (
                      <button type="submit" className="text-blue-500 font-semibold text-sm ml-2">Send</button>
                  ) : (
                      <div className="flex space-x-3 text-white">
                          <Icons.Image className="w-6 h-6" />
                          <Icons.Activity className="w-6 h-6" />
                      </div>
                  )}
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mb-4">
                <Icons.Send className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
            <p className="text-zinc-500 mb-4">Send private photos and messages to a friend or group.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">Send Message</button>
          </div>
        )}
      </div>
    </div>
  );
};
