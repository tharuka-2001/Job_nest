import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { uploadChatFile } from "../middleware/upload.js";
import chatController from "../controller/chat.controller.js";

const chatRouter = Router();

chatRouter.post(
  "/api/v1/chat/conversations",
  auth,
  chatController.getOrCreateConversation
);

chatRouter.get(
  "/api/v1/chat/conversations",
  auth,
  chatController.listMyConversations
);

chatRouter.get(
  "/api/v1/chat/conversations/:conversationId",
  auth,
  chatController.getMessages
);

// REST attachment upload (returns fileUrl)
chatRouter.post(
  "/api/v1/chat/attachments",
  auth,
  uploadChatFile.single("file"),
  chatController.uploadChatAttachment
);

export default chatRouter;
