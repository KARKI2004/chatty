import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useFriendStore } from '../store/useFriendStore';

const Sidebar = () => {
  const {getUsers, users, selectedUser, setSelectedUser, isUserLoading, lastMessageByUser} = useChatStore()

  const {onlineUsers}= useAuthStore();
  const { showMessagePreview } = useSettingsStore();
  const { friends, fetchFriends } = useFriendStore();
  const [showOnlineOnly,setShowOnlineOnly] = useState(false);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);

  useEffect(() => {
    getUsers()
    fetchFriends()
}, [getUsers, fetchFriends])

const friendIds = new Set(friends.map((friend) => friend._id));
let filteredUsers = users;
if (showFriendsOnly) {
  filteredUsers = filteredUsers.filter((user) => friendIds.has(user._id));
}
if (showOnlineOnly) {
  filteredUsers = filteredUsers.filter((user) => onlineUsers.includes(user._id));
}

if(isUserLoading) return <SidebarSkeleton/>;

return (
  <aside className = "h-full w-20 lg:w-[293px] border-r border-base-300 flex flex-col transition-all duration-200">
    <div className="bottom-b border-base-300 w-full p-5">
    <div className = "flex items-center gap-2">
      <Users className= "size-6"/>
      <span className = "font-medium hidden lg:block">Contacts</span>
    </div>


    <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
              style={{
                ["--chkbg"]: "rgb(176,154,204)",
                ["--chkfg"]: "rgb(176,154,204)",
                borderColor: "rgb(176,154,204)"
              }}
            />
            <span className="text-sm">Show online</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

        <div className="mt-2 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showFriendsOnly}
              onChange={(e) => setShowFriendsOnly(e.target.checked)}
              className="checkbox checkbox-sm"
              style={{
                ["--chkbg"]: "rgb(176,154,204)",
                ["--chkfg"]: "rgb(176,154,204)",
                borderColor: "rgb(176,154,204)"
              }}
            />
            <span className="text-sm">Show friends only</span>
          </label>
        </div>
      </div>


    <div className = "overflow-y-auto w-full py-3">
      {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {showMessagePreview
                  ? (lastMessageByUser[user._id]?.text
                      ? lastMessageByUser[user._id].text
                      : lastMessageByUser[user._id]?.image
                        ? "Photo"
                        : "No messages yet")
                  : (onlineUsers.includes(user._id) ? "Online" : "Offline")}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users to show</div>
        )}
    </div>
  </aside>
);
};

export default Sidebar
