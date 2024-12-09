// App.jsx or similar
import { Outlet } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import { useAdminContext } from './hooks/useAdminContext';
import Login from './pages/Login';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"

function App() {
  const { user, verifyUser } = useAdminContext();

  useEffect(() => {
    if (!localStorage.getItem("insta_admin")) return console.log("Token not availble !");
    if (user.isLoggedIn) return console.log("User is already loggedIn !");
    console.log("Token availble , verifying the admin ");
    verifyUser(localStorage.getItem("insta_admin"));
  }, []);

  return (

    <>


      {
        user.isLoggedIn ?

          <DashboardLayout>
            <Outlet />
            <Toaster />
          </DashboardLayout >
          :
          <Login />
      }


      {/* <h1>{user.name}</h1> */}



    </>
  );
}

export default App;
