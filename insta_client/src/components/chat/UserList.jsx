/* eslint-disable react/prop-types */
// UserList.js
// import Profile from './Profile';

function UserList({ users, user_id, onSelect, selectedUser }) {

    return (
        <div className={`w-full md:w-1/3 bg-gray-800 p-4 border-r ${selectedUser ? 'hidden' : 'block'} md:block`}>

            {/* logged in user profile  */}
            {/* <Profile /> */}


            {/* other users  */}
            <h2 className="text-3xl   m-4 insta_font">Chats</h2>
            <hr className="mb-2"/>
            <ul>
                {users.map((user) => (
                    user.user_id !== user_id && (
                        <li
                            key={user.user_id}
                            className={`flex items-center p-2 ${selectedUser?.user_id == user.user_id && "selectet_user_bg "} cursor-pointer hover:bg-gray-700 rounded`}
                            onClick={() => onSelect(user)}
                        >
                            {/* <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3">
                                {user.name[0].toUpperCase()}
                            </div> */}

                            <div className="relative w-10 h-10 mr-3">
                                {
                                    // online status of user
                                    user.online && <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                                }
                                {/* <div className="bg-orange-500 text-white rounded-full flex items-center justify-center w-full h-full">
                                    {user.name[0].toUpperCase()}
                                </div> */}

                                <img src={user.profile_url} alt="profile picture" className="rounded-full aspect-square bg-transparent"/>
                            </div>

                            <span className="font-semibold hover-text">{user.name.slice(0, 18)}</span>
                            {user.typing && <p className='text-sm text-green-500 ml-2'>Typing...</p>}

                            {
                                user.unread && (
                                    <span className='size-5 ml-3 text-sm flex justify-center bg-green-500 rounded-full'>1</span>
                                )
                            }
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}

export default UserList;
