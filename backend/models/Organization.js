import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // OWNER
    // ==========================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // COMPANY CONTACT
    // ==========================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // FULL ADDRESS
    // ==========================================

    address: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // BOOKING PAL
    // ==========================================

    currentBookingPalAccount: {
      type: String,
      enum: ["none", "yes", "no"],
      default: "none",
    },

    // ==========================================
    // LISTING INFORMATION
    // ==========================================

    nextListingExpirationDate: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ECBYO
    // ==========================================

    ecbyoPass: {
      type: String,
      default: "",
    },

    // ==========================================
    // PMS
    // ==========================================

    pmsUsed: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // UNITS
    // ==========================================

    totalUnitsManaged: {
      type: Number,
      default: 0,
    },

    unitsOnEcbyo: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // LISTING / FEED
    // ==========================================

    listingId: {
      type: String,
      default: "",
      trim: true,
    },

    feedDataLink: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // SOCIAL LINKS
    // These will NOT be in Create Form.
    // They will be available on Organization Details.
    // ==========================================

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // LINKED LEADS
    // ==========================================

    leads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
      },
    ],

    // ==========================================
    // NOTES
    // ==========================================

    notes: [
      {
        text: {
          type: String,
          default: "",
        },

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        pinned: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Organization",
  OrganizationSchema
);