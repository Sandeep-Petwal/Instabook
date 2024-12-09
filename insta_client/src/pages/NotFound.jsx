import { Link } from 'react-router-dom'
import Search from './Search'
import { Home } from 'lucide-react'

function Notfound() {
    return (
        <div className='w-full'>
            <div className="flex w-full flex-col items-center justify-center min-h-40 mt-14 mb-5 max-w-lg mx-auto  text-white text-center">
                <h1 className="text-9xl font-bold text-orange-600">404</h1>
                <p className="mt-4 text-lg ">Oops! </p>
                <p className="mt-2 ">The link you followed may be broken, or the page may have been removed. Go back to Instabook.</p>
                <Link to="/" className="mt-6 px-4 flex justify-center gap-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition">
                    <Home />
                    Home
                </Link>

            </div>
            <Search />
        </div>
    )
}

export default Notfound