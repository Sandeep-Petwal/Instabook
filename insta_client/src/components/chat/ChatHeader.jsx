/* eslint-disable react/prop-types */
import { IoVideocam, IoCloseCircle } from "react-icons/io5";
import { toast } from 'react-hot-toast';

function ChatHeader({ selectedUser, onBack }) {
    return (
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
            <div className="w-12 h-12 font-bold text-xl bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                {selectedUser.name[0].toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
            <div className="gap-10 ml-auto flex justify-center text-blue-400">
                <IoVideocam size={30} onClick={() => toast.error("Calling feature is not available yet!")} />
                <button onClick={onBack}>
                    <IoCloseCircle size={30} />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
