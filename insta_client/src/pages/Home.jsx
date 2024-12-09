import { useContext, useEffect } from 'react'
import { InstaContext } from '../context/InstaContext'
import LandingPage from './LandingPage';
import Search from "../components/feed_component/Search"
import Sidebar from '../components/feed_component/Sidebar';
import MainContent from '../components/feed_component/MainContent';
import RightSidebar from '../components/feed_component/RightSidebar';
import BottomNavigation from '../components/feed_component/BottomNavigation';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import Messages from '../components/Messages';
import Notification from '../components/Notification';

function Home() {
  const { user, login, logout, verifyUser, tab, setTab } = useContext(InstaContext);
  const navigate = useNavigate();

  return (
    <div>

      {
        !user.isLoggedIn ? <LandingPage /> :

          // <Feed />
          <div className="bg-black min-h-screen text-white pt-4 pb-16 lg:pb-0">
            {/* Left Sidebar - Hidden on mobile */}
            <Sidebar />

            {/* Main Content */}
            {/* {
              tab == "home" && <MainContent />
            }

            {
              tab == "profile" && <Profile />
            }

            {
              tab == "search" && <Search />
            }

            {
              tab == "messages" && <Messages />
            }
            {
              tab == "notification" && <Notification />
            }
            {

            } */}



            {/* Right Sidebar - Suggestions */}
            <RightSidebar />

            {/* Mobile Bottom Navigation */}
            <BottomNavigation />
          </div>
          
      }
    </div>
  )
}

export default Home
