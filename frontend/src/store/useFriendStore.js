import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useFriendStore = create((set, get) => ({
  requests: [],
  friends: [],
  isRequestsLoading: false,
  isFriendsLoading: false,
  isSendingRequest: false,
  isUpdatingRequest: false,

  fetchRequests: async (options = {}) => {
    const { notify } = options;
    set({ isRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ requests: res.data });
      if (notify && res.data.length > 0) {
        toast(`${res.data.length} friend request${res.data.length > 1 ? "s" : ""}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load requests");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  fetchFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  sendRequest: async (email) => {
    set({ isSendingRequest: true });
    try {
      const res = await axiosInstance.post("/friends/request", { email });
      toast.success(res.data.message || "Friend request sent");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send request");
      return false;
    } finally {
      set({ isSendingRequest: false });
    }
  },

  acceptRequest: async (userId) => {
    set({ isUpdatingRequest: true });
    try {
      const res = await axiosInstance.post(`/friends/accept/${userId}`);
      const friend = res.data;
      set({
        requests: get().requests.filter((req) => req._id !== userId),
        friends: [...get().friends, friend],
      });
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    } finally {
      set({ isUpdatingRequest: false });
    }
  },

  declineRequest: async (userId) => {
    set({ isUpdatingRequest: true });
    try {
      await axiosInstance.post(`/friends/decline/${userId}`);
      set({
        requests: get().requests.filter((req) => req._id !== userId),
      });
      toast.success("Friend request declined");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to decline request");
    } finally {
      set({ isUpdatingRequest: false });
    }
  },
}));
