import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import App from "../App";
import MainContent from "../components/feed_component/MainContent";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import Notification from "../components/Notification";
import PublicProfile from "../pages/PublicProfile";
import ForgetPassword from "../pages/ForgetPassword";
import Notfound from "../pages/NotFound";
import FollowRequests from "../pages/FollowRequests";
import Chat from "../components/chat/Chat";
import Settings from "../components/Setings";
import AdminLogin from "@/components/feed_component/mini_components/AdminLogin";

import TwoFectorAuth from "@/pages/TwoFectorAuth";
import ActiveSessions from "@/components/ActiveSessions";
import Support from "@/pages/support/Support";
import Issue from "@/pages/support/Issue";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/reset",
      element: <ForgetPassword />,
    },
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/home",
          element: <MainContent />,
        },
        {
          path: "/",
          element: <MainContent />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile/:user_id",
          element: <PublicProfile />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/messages",
          element: <Chat />,
        },
        {
          path: "/messages/:user_params",
          element: <Chat />,
        },
        {
          path: "/notification",
          element: <Notification />,
        },
        {
          path: "/request",
          element: <FollowRequests />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/settings/2fa",
          element: <TwoFectorAuth />,
        },
        {
          path: "/settings/sessions",
          element: <ActiveSessions />,
        },
        {
          path: "/settings/support",
          element: <Support />,
        },
        {
          path: "/settings/support/issue/:id",
          element: <Issue />,
        },
        {
          path: "*",
          element: <Notfound />,
        },
      ],
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ],
  {
    future: {
      v7_skipActionStatusRevalidation: true,
      v7_relativeSplatPath: true,
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
