import { useContext } from 'react'
import { InstaContext } from '../../context/InstaContext'
import { useNavigate } from 'react-router-dom';

function RightSidebar() {
  const { user, logout } = useContext(InstaContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Right Sidebar - Suggestions */}
      <div className="hidden xl:block w-[320px] sticky top-0 h-screen p-8 border-l border-zinc-800">
        {/* User Profile */}
        <div className="flex items-center justify-between mb-6">
          <div 
          onClick={() => navigate("/profile")}
          className="flex items-center cursor-pointer gap-3">
            <img
              src={user.profile_url || "profile.jpeg"}
              alt="Your profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-zinc-500">{user.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-blue-500 text-sm font-semibold">Logout</button>
        </div>
<h1 className='font-bold'>Suggested users</h1>
      </div>
    </div>
  )
}

export default RightSidebar
