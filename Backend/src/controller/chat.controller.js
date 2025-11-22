import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";
import JobPost from "../model/JobPost.js";

const chatController = {
  // !Create or get a conversation between two users (optionally tied to a job)
  getOrCreateConversation: async (req, res) => {
    try {
      const me = req.user.id;

      const { otherUserId, jobId } = req.body;

      // (Optional) authorization: if jobId is provided, allow only participants related to job (poster/applicant)
      if (jobId) {
        const job = await JobPost.findById(jobId);
        if (!job)
          return res
            .status(404)
            .json({ success: false, message: "Job not found" });
        // Typically, any user can start chat; you can restrict if needed
      }

      let convo = await Conversation.findOne({
        participants: { $all: [me, otherUserId], $size: 2 },
        ...(jobId ? { job: jobId } : {}),
      });

      if (!convo) {
        convo = await Conversation.create({
          participants: [me, otherUserId],
          job: jobId || undefined,
        });
      }

      res.status(201).json({ data: convo });
    } catch (e) {
      console.log("Cannot create or get the conversation", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //! List my conversations
  listMyConversations: async (req, res) => {
    try {
      const me = req.user.id;
      const convos = await Conversation.find({ participants: me })
        .sort({ lastMessageAt: -1 })
        .populate("participants", "email role profile");

      if (!convos) {
        return res.status(400).json({ message: "No conversations found" });
      }

      res.status(200).json({ data: convos });
    } catch (e) {
      console.log("Getting my conversation list error", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! Get messages in a conversation (paginated basic)
  getMessages: async (req, res) => {
    try {
      const me = req.user.id;
      const { conversationId } = req.params;

      const convo = await Conversation.findById(conversationId);
      if (!convo || !convo.participants.some((p) => String(p) === String(me))) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const msgs = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender", "email role profile");

      if (!msgs) {
        return res.status(400).json({ message: "Messages not found" });
      }

      res.status(200).json({ data: msgs.reverse() });
    } catch (e) {
      console.log("Getting message error", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! Upload chat file via REST (client sends message via socket after upload)
  uploadChatAttachment: async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      const fileUrl = `/uploads/chat/${req.file.filename}`;

      res
        .status(201)
        .json({ status: 201, message: "File Uploaded", data: { fileUrl } });
    } catch (e) {
      console.log("Uploading attachment error", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default chatController;
