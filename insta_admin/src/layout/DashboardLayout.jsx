import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Search,
  MessagesSquare,
  LogOut,
  User,
  Image,
  UserCircle2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminContext } from "@/hooks/useAdminContext";

function DashboardLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAdminContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        !toggleButton?.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/home" },
    { icon: <MessagesSquare className="w-5 h-5" />, label: "Support", path: "/support" },

    { icon: <Users className="w-5 h-5" />, label: "Users", path: "/users" },
    { icon: <Image className="w-5 h-5" />, label: "Posts", path: "/posts" },
    // { icon: <MessagesSquare className="w-5 h-5" />, label: 'Chat', path: '/chat' },
    {
      icon: <UserCircle2 className="w-5 h-5" />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-zinc-900 border-b border-zinc-800">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                id="sidebar-toggle"
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
              <Link to="/" className="flex ml-2 md:mr-24">
                {/* <span className="self-center font-bold gradient-text insta_font text-3xl  whitespace-nowrap text-white">
                  Instabook admin
                </span> */}


                <span className=" flex justify-center items-center gap-2 cursor-pointer">
                  <h1
                    className={`text-4xl font-serif insta_font text-center `}
                  >
                    Instabook
                  </h1>
                </span>

              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    className="rounded-full relative h-8 w-8 "
                    src={user.profile_url}
                    alt="user photo"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link to={"/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link to={"/settings"}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={logout}>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800",
          "md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <ul className="flex flex-col space-y-2">

            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:translate-x-1",
                      location.pathname.startsWith(item.path)
                        ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
                        : "hover:bg-zinc-800"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        location.pathname.startsWith(item.path)
                          ? "bg-gradient-to-r from-blue-700 to-blue-800"
                          : "bg-zinc-800 group-hover:bg-zinc-700"
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}

            <li
              onClick={logout} className="cursor-pointer"
            >
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:translate-x-1 hover:bg-zinc-800",
                )}
              >
                <div
                  className={`p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700`}
                >
                  <LogOut className="w-5 h-5" />                </div>
                <span className="text-sm font-medium">{"Logout"}</span>
              </div>
            </li>


          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          "p-4 pt-20", // Padding top for navbar
          "md:ml-64" // Margin for sidebar on desktop
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
