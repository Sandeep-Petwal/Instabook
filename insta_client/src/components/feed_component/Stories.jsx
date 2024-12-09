import React, { useState } from 'react'

function Stories() {
    document.title = "Instabook - Home"
    const [isHovered, setIsHovered] = useState(false);

    // Dummy data for stories
    const stories = [
        { id: 1, username: 'your_story', image: 'profile.webp' },
        { id: 2, username: 'john_doe', image: 'profile.webp' },
        { id: 3, username: 'jane_smith', image: 'profile.webp' },
        { id: 4, username: 'travel_buddy', image: 'profile.webp' },
        { id: 5, username: 'food_lover', image: 'profile.webp' },
        { id: 6, username: 'food_lover', image: 'profile.webp' },
    ];
    return (
        <div>
            {/* Stories */}
            <div className="overflow-hidden flex justify-center w-[390px] md:w-[500px] xl:w-[700px] px-4 mb-8">

                <div className="m-4 flex justify-center items-center gap-2 cursor-pointer">
                    <img src="black_logo.png" alt="logo" className='size-16' />
                    <h1
                        className={`text-5xl font-serif insta_font text-center ${isHovered ? 'gradient-text' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}  // Set state to true when hovered
                        onMouseLeave={() => setIsHovered(false)} // Set state to false when mouse leaves
                    >
                        Instabook
                    </h1>
                </div>


                {/* <div className="flex gap-4 pt-2">
                    {stories.map(story => (
                        <div key={story.id} className="flex flex-col items-center flex-shrink-0">
                            <div className="w-16 h-16 rounded-full ring-2 ring-orange-500 p-[2px] bg-black">
                                <img
                                    src={story.image}
                                    alt={story.username}
                                    className="w-full h-full rounded-full border-2 border-black"
                                />
                            </div>
                            <span className="text-xs mt-1 truncate w-16 text-center">{story.username}</span>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    )
}

export default Stories
