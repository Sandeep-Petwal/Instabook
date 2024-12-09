import { useContext, useEffect } from 'react'
import { InstaContext } from '../context/InstaContext'



function Navbar() {
  const { user, login, logout, verifyUser } = useContext(InstaContext);
  // if user is not logged in and token is availble verify the user

  useEffect(() => {
    if (localStorage.getItem("instabook_token")) {
      verifyUser(localStorage.getItem("instabook_token"))
    }
  }, [])

  return (
    <span>
      {/* <h1 className='text-red-600 text-center'>This is navbar</h1> */}
    </span>
  )
}

export default Navbar
