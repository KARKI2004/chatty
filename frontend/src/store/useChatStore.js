import {create} from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import {useAuthStore} from "./useAuthStore";
import { useSettingsStore } from "./useSettingsStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    lastMessageByUser: {},
    isUserLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({isUserLoading: false});
        }
            
    },
    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
            if (res.data.length > 0) {
                const lastMessage = res.data[res.data.length - 1];
                set({
                    lastMessageByUser: {
                        ...get().lastMessageByUser,
                        [userId]: lastMessage,
                    },
                });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({isMessagesLoading: false});
        }
    },
    sendMessage : async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            const exists = messages.some((msg) => msg._id === res.data._id);
            if (!exists) {
                 set({ messages: [...messages, res.data] });
            }
            set({
                lastMessageByUser: {
                    ...get().lastMessageByUser,
                    [selectedUser._id]: res.data,
                },
            });
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    },


    listenToMessages : () =>{
            const {selectedUser} = get();
            if(!selectedUser) return;

            const socket = useAuthStore.getState().socket;
            if (!socket) return;

            
            socket.on("newMessage",(newMessage) =>{
                set({
                    lastMessageByUser: {
                        ...get().lastMessageByUser,
                        [newMessage.senderId]: newMessage,
                    },
                });
                const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
                if (isMessageFromSelectedUser) {
                    console.log("SOCKET:", newMessage._id);
                    set({
                        messages: [...get().messages, newMessage],
                    });
                }

                const { notificationSounds } = useSettingsStore.getState();
                if (notificationSounds && typeof document !== "undefined" && document.hasFocus()) {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = ctx.createOscillator();
                        const gain = ctx.createGain();
                        oscillator.type = "sine";
                        oscillator.frequency.value = 640;
                        gain.gain.value = 0.04;
                        oscillator.connect(gain);
                        gain.connect(ctx.destination);
                        oscillator.start();
                        oscillator.stop(ctx.currentTime + 0.12);
                        oscillator.onended = () => ctx.close();
                    } catch {
                    }
                }
            });
        },
    
        unListenToMessages : () =>{
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
        },
    
    setSelectedUser: (selectedUser) => set({selectedUser}),
}));
