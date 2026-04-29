import mongoose from "mongoose";

const lastMessageSchema = new mongoose.Schema(
  {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    content: { type: String, default: "" },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "location", "deleted"],
      default: "text",
    },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sentAt: { type: Date },
  },
  { _id: false },
);

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    unreadCount: { type: Number, default: 0 },
    leftAt: { type: Date, default: null },
    mutedUntil: { type: Date, default: null },
    role: {
      type: String,
      enum: ["member", "admin", "owner"],
      default: "member",
    },
  },
  { _id: false },
);

const groupSettingsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    avatarUrl: { type: String, default: null },

    sendPermission: {
      type: String,
      enum: ["all", "admins"],
      default: "all",
    },

    editPermission: {
      type: String,
      enum: ["all", "admins"],
      default: "admins",
    },
    inviteLink: { type: String, default: null },
    inviteLinkExpiry: { type: Date, default: null },
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group", "channel"],
      required: true,
      index: true,
    },

    participants: {
      type: [participantSchema],
      validate: {
        validator(arr) {
          if (this.type === "direct") return arr.length === 2;
          return arr.length >= 2;
        },
        message:
          "Direct conversations must have exactly 2 participants; groups must have ≥ 2!",
      },
    },

    lastMessage: { type: lastMessageSchema, default: null },

    pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

    deletedAt: { type: Date, default: null },

    groupSettings: { type: groupSettingsSchema, default: null },

    callHistory: [
      {
        callType: { type: String, enum: ["audio", "video"] },
        initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        startedAt: Date,
        endedAt: Date,
        duration: Number,
        status: {
          type: String,
          enum: ["completed", "missed", "rejected", "failed"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

conversationSchema.index({ "participants.user": 1, updatedAt: -1 });

conversationSchema.index(
  { type: 1, "participants.user": 1 },
  { partialFilterExpression: { type: "direct" } },
);

conversationSchema.virtual("activeParticipantCount").get(function () {
  return this.participants.filter((p) => !p.leftAt).length;
});

conversationSchema.statics.findDirectConversation = function (
  userAId,
  userBId,
) {
  return this.findOne({
    type: "direct",
    "participants.user": { $all: [userAId, userBId] },
    deletedAt: null,
  });
};

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
