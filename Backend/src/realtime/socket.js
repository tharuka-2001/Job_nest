import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL?.split(",") || "*" },
  });

  // authenticate sockets using JWT from query.token or auth header
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );
      socket.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (e) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const me = socket.user.id;

    // client should join conversation rooms they view
    socket.on("join_conversation", async ({ conversationId }) => {
      const convo = await Conversation.findById(conversationId);
      if (!convo) return;
      const isMember = convo.participants.some((p) => String(p) === String(me));
      if (!isMember) return;
      socket.join(`conv:${conversationId}`);
    });

    // send message to a conversation
    socket.on("send_message", async ({ conversationId, text, fileUrl }) => {
      if (!conversationId) return;
      const convo = await Conversation.findById(conversationId);
      if (!convo) return;
      const isMember = convo.participants.some((p) => String(p) === String(me));
      if (!isMember) return;

      const msg = await Message.create({
        conversation: conversationId,
        sender: me,
        text: text || null, // emojis OK
        fileUrl: fileUrl || null,
        readBy: [me],
      });

      convo.lastMessageAt = new Date();
      await convo.save();

      const payload = await msg.populate("sender", "email role profile");
      io.to(`conv:${conversationId}`).emit("new_message", payload);
    });

    // mark as read
    socket.on("mark_read", async ({ conversationId }) => {
      await Message.updateMany(
        { conversation: conversationId, readBy: { $ne: me } },
        { $addToSet: { readBy: me } }
      );
    });
  });

  return io;
};
