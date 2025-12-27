import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/decline/:id", protectRoute, declineFriendRequest);
router.get("/", protectRoute, getFriends);

export default router;
