import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, listenToMessages, unListenToMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      listenToMessages();

      return () => unListenToMessages();   
    }
  }, [selectedUser._id, getMessages, listenToMessages, unListenToMessages]);


  useEffect(() => {
  const scroll = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  scroll();
  const imgs = document.querySelectorAll("img");
  imgs.forEach(i => i.addEventListener("load", scroll));
  return () => imgs.forEach(i => i.removeEventListener("load", scroll));
}, [messages]);


  return (
    <div className="flex flex-col h-full w-full px-4 sm:px-6">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messagesEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full border">
              <img
                src={message.senderId === authUser._id ?
                  authUser.profilePic || "/avatar.png"
                  : selectedUser.profilePic || "/avatar.png"
                }
                alt="Profile pic"
                className="w-full h-full object-cover"
              />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
