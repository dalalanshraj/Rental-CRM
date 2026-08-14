import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    website: String,
   phone: {
  type: String,
  default: "",
},
    email: String,
    industry: String,

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    //         notes: [
    //   {
    //     text: String,

    //     createdBy: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //     },

    //     createdAt: {
    //       type: Date,
    //       default: Date.now,
    //     },

    //     pinned: {
    //       type: Boolean,
    //       default: false,
    //     },
    //   },
    // ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    leads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Organization", OrganizationSchema);
