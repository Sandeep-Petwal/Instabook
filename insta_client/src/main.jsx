import "./index.css"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router.jsx'
import { InstaContextProvider } from "./context/InstaContext.jsx"
import { SocketProvider } from "./context/socketContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID


createRoot(document.getElementById('root')).render(
  <>
    <GoogleOAuthProvider clientId={clientId} >

      <InstaContextProvider>
        <SocketProvider >
          <RouterProvider router={router} />
        </SocketProvider>
      </InstaContextProvider>

    </GoogleOAuthProvider>
  </>,
)
