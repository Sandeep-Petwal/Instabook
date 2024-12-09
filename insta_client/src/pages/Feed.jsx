import { useState, useRef, useEffect } from 'react';
import {
  Home, Search, Compass,
  MessageCircle, Heart, PlusSquare,
  User, Menu, MoreHorizontal,
  LogOutIcon
} from 'lucide-react';
import Sidebar from '../components/feed_component/Sidebar';
import MainContent from '../components/feed_component/MainContent';
import RightSidebar from '../components/feed_component/RightSidebar';
import BottomNavigation from '../components/feed_component/BottomNavigation';

document.title = "Instabook"

const Feed = () => {

// TODO: not in use

  return (
    <div className="bg-black min-h-screen text-white pt-4 pb-16 lg:pb-0">
      {/* Left Sidebar - Hidden on mobile */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />

      {/* Right Sidebar - Suggestions */}
      <RightSidebar />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Feed;