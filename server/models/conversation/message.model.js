import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deliveredAt: { type: Date, default: null },
    seenAt: { type: Date, default: null },
  },
  { _id: false },
);

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emoji: { type: String, required: true, maxlength: 10 },
    reactedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },

    mimeType: { type: String, required: true },

    fileName: { type: String, default: null },

    sizeBytes: { type: Number, default: null },

    thumbnailUrl: { type: String, default: null },

    duration: { type: Number, default: null },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    label: { type: String, default: null },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contentType: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "audio",
        "file",
        "location",
        "call",
        "deleted",
      ],
      required: true,
      default: "text",
    },

    content: {
      type: String,
      maxlength: 8_000,
      default: "",
    },

    attachments: { type: [attachmentSchema], default: [] },

    location: { type: locationSchema, default: null },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    receipts: { type: [receiptSchema], default: [] },

    reactions: { type: [reactionSchema], default: [] },

    deletedAt: { type: Date, default: null },

    editHistory: [
      {
        content: String,
        editedAt: { type: Date, default: Date.now },
      },
    ],

    callData: {
      callType: { type: String, enum: ["audio", "video"] },
      duration: Number,
      status: { type: String, enum: ["completed", "missed", "rejected"] },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

messageSchema.index({ conversation: 1, createdAt: -1 });

messageSchema.index({ conversation: 1, sender: 1 });

messageSchema.virtual("isEdited").get(function () {
  return this.editHistory.length > 0;
});

messageSchema.virtual("isDeleted").get(function () {
  return this.contentType === "deleted";
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
