import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    // kis lead se note create hua
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    // kis organization se note create hua
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // kis user ne note likha
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pinned: {
      type: Boolean,
      default: false,
    },
    order: {
  type: Number,
  default: 0,
},

pinnedAt: {
  type: Date,
  default: null,
},
edited: {
  type: Boolean,
  default: false,
},
editedAt: {
  type: Date,
  default: null,
},

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", noteSchema);