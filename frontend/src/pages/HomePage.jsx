import React from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const {selectedUser} = useChatStore();


  return (
    <div className="h-screen bg-base-200">
      <div className="flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-3xl border border-[rgba(176,154,204,0.6)] shadow-cl w-full max-w-7xl h-[calc(100vh-7rem)]">
          <div className="flex h-full rounded-3xl overflow-hidden">
            <Sidebar/>
            {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
          </div>
        </div>

      

      </div>

    </div>
  )
}

export default HomePage;
