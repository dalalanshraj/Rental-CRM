// models/Lead.js
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },

    organization: String,

    phone: [
        {
            number: String,
            label: {
                type: String,
                default: "work"
            }
        }
    ],

    email: [
        {
            address: String,
            label: {
                type: String,
                default: "work"
            }
        }
    ],

    //  Owner 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // Website URl
    website: String,
    instagram: String,

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

    notes: String

}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);