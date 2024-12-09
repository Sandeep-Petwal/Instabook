import React, {useRef} from 'react'

function EditComment() {
    return (
        <button
            onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
            className="hover:text-zinc-400"
        >
            <MoreHorizontal size={20} />
            {openMenuId === post.id && (
                <div className="relative top-full mt-1 w-48 bg-black rounded-lg shadow-lg border border-zinc-500 z-50">
                    <div className="py-1">
                        <button
                            className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                            onClick={() => {
                                console.log('Follow/Unfollow:', post.username);
                                setOpenMenuId(null);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                            onClick={() => {
                                console.log('Follow/Unfollow:', post.username);
                                setOpenMenuId(null);
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            )}

        </button>
    )
}

export default EditComment
