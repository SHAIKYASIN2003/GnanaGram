import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Icons } from './components/Icons';
import { UploadModal } from './components/UploadModal';
import { Login } from './pages/Login';
import { HomePage } from './pages/Home';
import { ExplorePage } from './pages/Explore';
import { ProfilePage } from './pages/Profile';
import { Messages } from './pages/Messages';
import { Reels } from './pages/Reels';
import { Notifications } from './pages/Notifications';

// -- Sidebar Component --
const Sidebar = ({ onCreateOpen }: { onCreateOpen: () => void }) => {
  const { currentUser, notifications } = useApp();
  const location = useLocation();
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, active, badge }: any) => (
    <Link to={to} className={`flex items-center p-3 rounded-lg mb-2 transition-all group ${active ? 'font-bold' : 'hover:bg-zinc-900'} relative`}>
      <Icon className={`w-7 h-7 transition-transform group-hover:scale-105 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
      {badge > 0 && (
          <div className="absolute top-2 left-7 w-2 h-2 bg-red-500 rounded-full lg:hidden"></div>
      )}
      <span className={`ml-4 text-md hidden lg:block ${active ? 'font-bold' : 'font-normal'}`}>{label}</span>
      {badge > 0 && (
          <div className="hidden lg:flex absolute right-2 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
             {badge}
          </div>
      )}
    </Link>
  );

  if (!currentUser) return null;

  return (
    <div className="hidden md:flex flex-col w-16 lg:w-64 h-screen border-r border-zinc-800 fixed left-0 top-0 bg-black text-white px-2 lg:px-4 pt-8 z-40">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold italic hidden lg:block font-serif tracking-wide">InstaGemini</h1>
        <Icons.Camera className="w-8 h-8 lg:hidden" />
      </div>
      
      <nav className="flex-1">
        <NavItem to="/" icon={Icons.Home} label="Home" active={isActive('/')} />
        <NavItem to="/explore" icon={Icons.Search} label="Search" active={isActive('/explore')} />
        <NavItem to="/explore" icon={Icons.Reels} label="Explore" active={false} />
        <NavItem to="/reels" icon={Icons.Video} label="Reels" active={isActive('/reels')} />
        <NavItem to="/messages" icon={Icons.Send} label="Messages" active={isActive('/messages')} />
        <NavItem to="/notifications" icon={Icons.Activity} label="Notifications" active={isActive('/notifications')} badge={unreadNotifications} />
        
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
  if (!currentUser) return null;
  
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

const Layout = () => {
    const { currentUser } = useApp();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    if (!currentUser) {
        return <Login />;
    }

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
                    <Route path="/notifications" element={<Notifications />} />
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
        <Layout />
      </HashRouter>
    </AppProvider>
  );
};

export default App;