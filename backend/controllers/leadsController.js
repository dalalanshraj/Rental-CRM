import Leads from "../models/Leads.js"

// Add leads Data
export const createLeads = async (req, res) => {
    try {
        const lead = await Leads.create({
            ...req.body,
            owner: req.user.id
        });

        const populatedLead = await Leads.findById(lead._id)
            .populate("owner", "name email role");

        res.status(201).json(populatedLead);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all leads Data

export const getLeads = async (req , res) => {
    try{
        const {userId , search} = req.query;
        let filter ={};

        // user filter
        if(userId) {
            filter.owner = userId
        }
        if(search) {
            filter.$or =[
                {name:{$regex: search,$options:"i"}},
                {organization: {$regex: search,$options: "i"}},
                {"email.address":{$regex: search , $options :"i"}},
                {"phone.number" : {$regex :search , $options :"i"}}
            ];
        }
        const leads = await Leads.find(filter)
        .populate("owner" , "name email")
        .sort({ createdAt : -1 });

        res.json(leads);
    }catch(error){
        res.status(500).json({message:error.message})
    }
};

// update leads 

export const updateLeads = async (req, res) => {
    try {
        const lead = await Leads.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("owner", "name email  role");
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete leads

export const deleteLeads = async (req, res) => {
    try {
        const lead = await Leads.findByIdAndDelete(req.params.id);
        res.json({ message: "lead Delete succesfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}