import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import RightSidebar from "./components/feed_component/RightSidebar";
import BottomNavigation from "./components/feed_component/BottomNavigation";
import Sidebar from "./components/feed_component/Sidebar";
import { useContext } from 'react';
import { InstaContext } from './context/InstaContext';
import LandingPage from "./pages/LandingPage";

function App() {
  const { user } = useContext(InstaContext);
  const location = useLocation();

  //  if the current path includes '/messages'
  const isMessagesPath = location.pathname.includes('/messages');

  return (
    <>
      <div className="main max-w-screen">
        <Navbar />
        {
          user.isLoggedIn ? (
            <div className="main_container  flex justify-center w-screen bg-black min-h-screen text-white pb-16 lg:pb-0">
              <Sidebar /> {/* large devices */}
              <Outlet />
              {!isMessagesPath && <RightSidebar />}
              <BottomNavigation /> {/* small devices */}
            </div>
          ) : (
            <LandingPage />
          )
        }
      </div>
    </>
  );
}

export default App;