/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { MessageSquareText, SearchIcon, SearchXIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function debounce(functionToDebounce, delayInMs) {

  let timerID;
  return function (...args) {
    clearTimeout(timerID);

    timerID = setTimeout(() => {
      functionToDebounce(...args);
    }, delayInMs);
  };
}

function Search() {
  const navigate = useNavigate();
  document.title = "Instabook - Search"
  const instabook_token = localStorage.getItem("instabook_token");
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Original function
  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      const response = await axios.get(`${apiUrl}/user/search?value=${query}`, {
        headers: { instabook_token }
      })

        // console.table(response.data);
      setUsers(response.data);


    } catch (error) {
      console.log(error);
      setUsers([]);
    } finally {
      setIsFetching(false);
    }
  };

  //  memoized debounced  fetchUsers function
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 500), []);



  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setIsFetching(true);
    debouncedFetchUsers(value);
    setUsers([]);
    setSearchValue(value);
  };


  return (
    <div className="mt-20 w-full p-5">
      {/* Search bar */}
      <section className="dark">
        <form className="max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full h-16 p-4 ps-10 text-lg caret-orange-600 text-gray-900 border  rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Users"
              value={searchValue}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="text-white mb-1 absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {
                isFetching ?
                  <img src="loading.gif" alt="Loading" className="size-5" />
                  : "Search"
              }
              {/* Search */}
            </button>
          </div>
        </form>
      </section>

      <section className="max-w-md mx-auto mt-2 mb-32">
        {isFetching && searchValue.trim() != "" && < p className="text-center text-gray-500 ">
          <img src="./loading2.gif" alt="loading" className="h-20 m-auto mt-14" />
        </p>}

        {/* Results list */}
        {users.length > 0 ? (
          <div className="mt-9">

            {
              users.map((user) => {
                return (
                  <Link
                    key={user.user_id} className="relative flex cursor-pointer items-center m-2 hover:bg-gray-800 bg-gray-900 p-3 gap-6">
                    {<img
                      onClick={() => navigate(`/profile/${user.user_id}`)}
                      src={user.profile_url} alt={user.profile_img} className="h-14 rounded-full" />}
                    <div
                      onClick={() => navigate(`/profile/${user.user_id}`)}
                    >
                      <p>{user.name}</p>
                      <p>{user.username}</p>
                    </div>
                    {/* <UserRound className="absolute right-20" /> */}
                    <button
                      onClick={() => navigate(`/messages/${user.user_id}`)}
                      className="p-4 hover:bg-gray-700 absolute right-10"
                    >
                      <MessageSquareText className="" />
                    </button>
                  </Link>
                )
              })
            }
          </div>
        ) : (
          searchValue.trim() != "" && !isFetching && !isFetching &&
          <div className="h-full w-full hover:text-gray-300 cursor-pointer text-gray-400 flex flex-col gap-4 items-center justify-center mt-16">
            <SearchXIcon size={120} />
            <h1 className="text-3xl">No result found !</h1>
          </div>

        )}

        {
          searchValue.trim() == "" &&
          <div className="h-full w-full hover:text-gray-300 cursor-pointer text-gray-400 flex flex-col gap-4 items-center justify-center mt-16">
            <SearchIcon size={120} />
            <h1 className="text-3xl">Search Users</h1>
          </div>
        }
      </section>
    </div >
  );
}

export default Search;