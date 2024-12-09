import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import App from "./App";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import TwoFectorAuth from "./components/TwoFectorAuth";
import Notfound from "./pages/NotFound";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AdminSessions from "./components/AdminSessions";
import Support from "./support/Support";
import Issue from "./support/Issue";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />

            },
            {
                path: "/home",
                element: <Home />

            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/users/:user_id",
                element: <UserProfile />
            },
            {
                path: "/posts",
                element: <Posts />
            },
            {
                path: "/settings",
                element: <Settings />
            },
            {
                path: "/profile",
                element: <Profile />

            },
            {
                path: "/support",
                element: <Support />

            },
            {
                path: "/support/:id",
                element: <Issue />

            },
            {
                path: "/settings/2fa",
                element: <TwoFectorAuth />

            }, {
                path: "/settings/sessions",
                element: <AdminSessions />

            },
            {
                path: "*",
                element: <Notfound />
            }
        ]
    }
]);

export default router;
