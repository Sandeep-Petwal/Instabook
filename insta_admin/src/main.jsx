import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AdminContextProvider } from './context/AdminContext';
import router from "./router.jsx";
import { SocketContextProvider } from './context/socketContext';


createRoot(document.getElementById('root')).render(
  <>
    <AdminContextProvider >
      <SocketContextProvider    >
        <RouterProvider router={router} />
      </SocketContextProvider>
    </AdminContextProvider>
  </>,
)
