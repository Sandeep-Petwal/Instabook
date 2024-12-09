/* eslint-disable react/prop-types */
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatBox({ selectedUser, messages, user_id, message, setMessage, handleSendMessage, handleBack, handleKeyDown }) {
    return (
        <div className={`flex-1 h-screen flex flex-col ${selectedUser ? '' : 'hidden md:block'}`}>
            {selectedUser ? (
                <>
                    <ChatHeader selectedUser={selectedUser} onBack={handleBack} />
                    <MessageList messages={messages} user_id={user_id} />
                    <MessageInput message={message} setMessage={setMessage} onSendMessage={handleSendMessage} onKeyDown={handleKeyDown} />
                </>
            ) : (
                <div className="h-full flex items-center justify-center flex-1">
                    <p className="text-gray-400">Select two user to start chatting</p>
                </div>
            )}
        </div>
    );
}

export default ChatBox;
