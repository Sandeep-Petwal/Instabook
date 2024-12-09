import React from 'react';
import { 
  Home, Search, Film, 
  MessageCircle, Heart, PlusSquare, 
  User, Menu, Compass, MoreHorizontal 
} from 'lucide-react';

// Previous dummy data remains the same
const InstagramFeed = () => {
  // Dummy data for stories
  const stories = [
    { id: 1, username: 'your_story', image: '/api/placeholder/60/60' },
    { id: 2, username: 'john_doe', image: '/api/placeholder/60/60' },
    { id: 3, username: 'jane_smith', image: '/api/placeholder/60/60' },
    { id: 4, username: 'travel_buddy', image: '/api/placeholder/60/60' },
    { id: 5, username: 'food_lover', image: '/api/placeholder/60/60' },
    { id: 6, username: 'tech_geek', image: '/api/placeholder/60/60' },
  ];

  // Dummy data for posts
  const posts = [
    {
      id: 1,
      username: 'photography_pro',
      userImage: '/api/placeholder/40/40',
      postImage: '/api/placeholder/600/800',
      likes: 1234,
      caption: 'Beautiful sunset view! 🌅',
      comments: 89,
      timeAgo: '2h'
    },
    {
      id: 2,
      username: 'travel_explorer',
      userImage: '/api/placeholder/40/40',
      postImage: '/api/placeholder/600/600',
      likes: 856,
      caption: 'Adventure awaits! 🏔️',
      comments: 45,
      timeAgo: '4h'
    }
  ];

  // Dummy suggested users
  const suggestedUsers = [
    { id: 1, username: 'art_lover', image: '/api/placeholder/40/40', followers: 'Followed by user1 + 3 more' },
    { id: 2, username: 'music_vibes', image: '/api/placeholder/40/40', followers: 'Followed by user2 + 2 more' },
    { id: 3, username: 'fitness_guru', image: '/api/placeholder/40/40', followers: 'Followed by user3 + 4 more' },
  ];
  return (
    <div className="bg-black min-h-screen text-white pb-16 lg:pb-0">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="fixed left-0 top-0 h-full w-[240px] border-r border-zinc-800 p-4 hidden lg:block">
        {/* ... (previous sidebar content remains the same) */}
      </div>

      {/* Main Content - Adjusted padding for mobile */}
      <div className="lg:ml-[240px] max-w-[630px] mx-auto pt-4">
        {/* Stories section remains the same */}
        {/* Posts section remains the same */}
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      <div className="fixed right-0 top-0 w-[320px] h-full p-8 hidden xl:block">
        {/* ... (previous right sidebar content remains the same) */}
      </div>

      {/* Mobile Bottom Navigation - Visible only on small screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 lg:hidden">
        <div className="flex justify-around items-center h-16 px-4">
          <button className="p-2">
            <Home size={24} />
          </button>
          <button className="p-2">
            <Search size={24} />
          </button>
          <button className="p-2">
            <PlusSquare size={24} />
          </button>
          <button className="p-2">
            <Film size={24} />
          </button>
          <button className="p-2">
            <User size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed;