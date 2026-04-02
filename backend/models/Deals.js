import mongoose from "mongoose"

const dealsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 0
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },
    organization: String,

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    stage: {
        type: String,
        enum: [
            "qualified",
            "contacted",
            "proposal",
            "negotiation",
            "won",
            "lost"
        ],
        default: "qualified",
    },
    products:[
        {
            name:String,
            price:Number,
            quantity:Number,
            tax:Number, //%
            amout:Number,
        }
    ],

    expectedCloseDate : Date,
}, {timestamps: true});

export default mongoose.model("Deal" , dealsSchema);