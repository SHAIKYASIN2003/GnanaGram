import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Icons } from './components/Icons';
import { UploadModal } from './components/UploadModal';
import { FeedPost } from './components/FeedPost';
import { Messages } from './pages/Messages';
import { Reels } from './pages/Reels';

// -- Sidebar Component --
const Sidebar = ({ onCreateOpen }: { onCreateOpen: () => void }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, active }: any) => (
    <Link to={to} className={`flex items-center p-3 rounded-lg mb-2 transition-all group ${active ? 'font-bold' : 'hover:bg-zinc-900'}`}>
      <Icon className={`w-7 h-7 transition-transform group-hover:scale-105 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
      <span className={`ml-4 text-md hidden lg:block ${active ? 'font-bold' : 'font-normal'}`}>{label}</span>
    </Link>
  );

  return (
    <div className="hidden md:flex flex-col w-16 lg:w-64 h-screen border-r border-zinc-800 fixed left-0 top-0 bg-black text-white px-2 lg:px-4 pt-8 z-40">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold italic hidden lg:block">InstaGemini</h1>
        <Icons.Camera className="w-8 h-8 lg:hidden" />
      </div>
      
      <nav className="flex-1">
        <NavItem to="/" icon={Icons.Home} label="Home" active={isActive('/')} />
        <NavItem to="/explore" icon={Icons.Search} label="Search" active={isActive('/explore')} />
        <NavItem to="/explore" icon={Icons.Reels} label="Explore" active={false} />
        <NavItem to="/reels" icon={Icons.Video} label="Reels" active={isActive('/reels')} />
        <NavItem to="/messages" icon={Icons.Send} label="Messages" active={isActive('/messages')} />
        <div className="hidden lg:block">
           <NavItem to="#" icon={Icons.Activity} label="Notifications" active={false} />
        </div>
        
        <div 
            onClick={onCreateOpen}
            className="flex items-center p-3 rounded-lg mb-2 hover:bg-zinc-900 cursor-pointer group"
        >
             <Icons.Create className="w-7 h-7 group-hover:scale-105 stroke-[1.5px]" />
             <span className="ml-4 text-md hidden lg:block">Create</span>
        </div>

        <Link to="/profile" className="flex items-center p-3 rounded-lg hover:bg-zinc-900 mt-2">
           <img src={currentUser.avatarUrl} className="w-6 h-6 rounded-full border border-white/20" />
           <span className="ml-4 text-md hidden lg:block font-semibold">Profile</span>
        </Link>
      </nav>

      <div className="pb-6 px-2">
         <Link to="#" className="flex items-center p-3 rounded-lg hover:bg-zinc-900">
            <Icons.More className="w-7 h-7" />
            <span className="ml-4 text-md hidden lg:block">More</span>
         </Link>
      </div>
    </div>
  );
};

// -- Mobile Bottom Bar --
const BottomBar = ({ onCreateOpen }: { onCreateOpen: () => void }) => {
  const { currentUser } = useApp();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-zinc-800 flex items-center justify-around z-50 px-2">
       <Link to="/"><Icons.Home className="w-6 h-6" /></Link>
       <Link to="/explore"><Icons.Search className="w-6 h-6" /></Link>
       <button onClick={onCreateOpen}><Icons.Create className="w-6 h-6" /></button>
       <Link to="/reels"><Icons.Video className="w-6 h-6" /></Link>
       <Link to="/profile">
          <img src={currentUser.avatarUrl} className="w-6 h-6 rounded-full border border-white/20" />
       </Link>
    </div>
  );
};

// -- Pages --

const HomePage = () => {
  const { posts, users, stories } = useApp();
  
  return (
    <div className="flex flex-col items-center w-full pt-4 md:pt-8 px-2">
        {/* Stories Rail */}
        <div className="w-full max-w-[630px] flex space-x-4 overflow-x-auto hide-scrollbar mb-8 pb-2">
            {stories.map(story => {
                const u = users.find(u => u.id === story.userId);
                if(!u) return null;
                return (
                    <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[66px] cursor-pointer">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-600">
                            <img src={u.avatarUrl} className="w-full h-full rounded-full border-2 border-black" />
                        </div>
                        <span className="text-xs text-zinc-300 truncate w-16 text-center">{u.username}</span>
                    </div>
                )
            })}
        </div>

        {/* Feed */}
        <div className="w-full max-w-[470px]">
            {posts.map(post => {
               const author = users.find(u => u.id === post.userId);
               return author ? <FeedPost key={post.id} post={post} author={author} /> : null;
            })}
        </div>
    </div>
  );
};

const ExplorePage = () => {
    return (
        <div className="p-4 grid grid-cols-3 gap-1 md:gap-4 max-w-5xl mx-auto">
            {Array.from({length: 20}).map((_, i) => (
                <div key={i} className={`relative aspect-square group cursor-pointer ${i % 10 === 2 ? 'row-span-2 col-span-1 h-full' : ''}`}>
                    <img 
                        src={`https://picsum.photos/seed/exp${i}/500/500`} 
                        className="w-full h-full object-cover" 
                        alt="Explore" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 text-white font-bold transition-opacity">
                        <div className="flex items-center"><Icons.Activity className="w-6 h-6 mr-1 fill-white" /> {Math.floor(Math.random() * 1000)}</div>
                        <div className="flex items-center"><Icons.Message className="w-6 h-6 mr-1 fill-white" /> {Math.floor(Math.random() * 100)}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ProfilePage = () => {
    const { currentUser, posts } = useApp();
    const myPosts = posts.filter(p => p.userId === currentUser.id);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <img src={currentUser.avatarUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-zinc-800" alt="Profile" />
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-xl font-light">{currentUser.username}</h2>
                        <button className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700">Edit profile</button>
                        <button className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-700">View Archive</button>
                        <Icons.Settings className="w-6 h-6" />
                    </div>
                    <div className="flex gap-8 mb-4 text-sm md:text-base">
                        <div><span className="font-semibold">{myPosts.length}</span> posts</div>
                        <div><span className="font-semibold">{currentUser.followers}</span> followers</div>
                        <div><span className="font-semibold">{currentUser.following}</span> following</div>
                    </div>
                    <div>
                        <h3 className="font-semibold">{currentUser.fullName}</h3>
                        <p className="text-sm whitespace-pre-line">{currentUser.bio}</p>
                        <a href="#" className="text-sm text-blue-200 font-semibold flex items-center mt-1"><Icons.AI className="w-3 h-3 mr-1"/> Created with Gemini</a>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-t border-zinc-800 flex justify-center gap-12 text-xs font-semibold tracking-widest text-zinc-500 mb-4">
                <div className="border-t border-white text-white py-3 flex items-center gap-2"><Icons.Home className="w-3 h-3"/> POSTS</div>
                <div className="py-3 flex items-center gap-2"><Icons.Save className="w-3 h-3"/> SAVED</div>
                <div className="py-3 flex items-center gap-2"><Icons.Profile className="w-3 h-3"/> TAGGED</div>
            </div>

            {/* Grid */}
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
                {/* Fillers for demo */}
                {Array.from({length: 6}).map((_,i) => (
                     <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-zinc-800">
                        <Icons.Image className="w-8 h-8" />
                     </div>
                ))}
            </div>
        </div>
    )
}

const MainLayout = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      <Sidebar onCreateOpen={() => setIsUploadOpen(true)} />
      <main className="flex-1 md:ml-16 lg:ml-64 min-h-screen relative pb-12 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/reels" element={<Reels />} />
        </Routes>
      </main>
      <BottomBar onCreateOpen={() => setIsUploadOpen(true)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
