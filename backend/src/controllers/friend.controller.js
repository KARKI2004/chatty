import User from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const receiver = await User.findOne({ email });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (receiver._id.equals(senderId)) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.friends?.includes(receiver._id)) {
      return res.status(400).json({ message: "You are already friends" });
    }
    if (sender.friendRequestsSent?.includes(receiver._id)) {
      return res.status(400).json({ message: "Request already sent" });
    }
    if (sender.friendRequestsReceived?.includes(receiver._id)) {
      return res
        .status(400)
        .json({ message: "They already sent you a request" });
    }

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friendRequestsSent: receiver._id },
    });
    await User.findByIdAndUpdate(receiver._id, {
      $addToSet: { friendRequestsReceived: senderId },
    });

    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.log("Error sending friend request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "friendRequestsReceived"
    );
    const requests = await User.find({
      _id: { $in: user.friendRequestsReceived || [] },
    }).select("-password");

    return res.status(200).json(requests);
  } catch (error) {
    console.log("Error fetching friend requests:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { id: senderId } = req.params;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!receiver.friendRequestsReceived?.includes(senderId)) {
      return res.status(400).json({ message: "No pending request" });
    }

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { friends: senderId },
      $pull: { friendRequestsReceived: senderId },
    });
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: receiverId },
      $pull: { friendRequestsSent: receiverId },
    });

    const friend = await User.findById(senderId).select("-password");
    return res.status(200).json(friend);
  } catch (error) {
    console.log("Error accepting friend request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { id: senderId } = req.params;

    await User.findByIdAndUpdate(receiverId, {
      $pull: { friendRequestsReceived: senderId },
    });
    await User.findByIdAndUpdate(senderId, {
      $pull: { friendRequestsSent: receiverId },
    });

    return res.status(200).json({ message: "Request declined" });
  } catch (error) {
    console.log("Error declining friend request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends");
    const friends = await User.find({
      _id: { $in: user.friends || [] },
    }).select("-password");

    return res.status(200).json(friends);
  } catch (error) {
    console.log("Error fetching friends:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
