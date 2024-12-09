import "./index.css"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router.jsx'
import { InstaContextProvider } from "./context/InstaContext.jsx"
import { SocketProvider } from "./context/socketContext.jsx";


createRoot(document.getElementById('root')).render(
  <>
    <InstaContextProvider>
      <SocketProvider >
        <RouterProvider router={router} />
      </SocketProvider>
    </InstaContextProvider>
  </>,
)
