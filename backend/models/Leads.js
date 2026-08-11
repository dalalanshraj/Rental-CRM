// models/Lead.js
import mongoose, { mongo } from "mongoose";

const leadSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

   organization: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
  default: null,
},

    phone: [
        {
            number: String,
            label: {
                type: String,
                enum: ["work", "home", "mobile", "other"],
                default: "work"
            }
        }
    ],

    email: [
        {
            address: String,
            label: {
                type: String,
                enum: ["work", "home", "mobile", "other"],
                default: "work"
            }
        }
    ],

    //  Owner 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    //Activities
   activities: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
],
    

    // Website URl
    website: String,
    instagram: String,
    facebook:String,

    // Address 
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,

    },

    //  Extra
    labels: [String],
    title: String,

    //  Organization Data
    unitsOnECBYO: Number,
    totalUnitsManaged: Number,
    vrsId: String,
    vrsUsed: String,
    listingId: String,

    // ECBYO Email
    ecbEmail: String,


    //  Date
    nextExpirationDate: Date,

    // CRM
    status: {
        type: String,
        enum: ["new", "lost", "won"],
        default: "new"
    },

//   notes: [
//   {
//     text: String,
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     pinned: {
//       type: Boolean,
//       default: false
//     }
//   }
// ]

}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);