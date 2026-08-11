import Leads from "../models/Leads.js"
import Organization from "../models/Organization.js";


// Add leads Data
export const createLeads = async (req, res) => {
  try {
    const lead = await Leads.create({
      ...req.body,
      owner: req.user.id,
      organization: req.body.organization
      
    });

    if (req.body.organization) {
  await Organization.findByIdAndUpdate(
    req.body.organization,
    {
      $push: {
        leads: lead._id
      }
    }
  );
}

    const populatedLead = await Leads.findById(lead._id)
      .populate("owner", "name email role");

    res.status(201).json(populatedLead);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leads Data

export const getLeads = async (req, res) => {
  try {
    const { search, userId } = req.query;

    let filter = {};

    // Default owner filter
    if (!search) {
      filter.owner = userId || req.user.id;
    }

    // Search
    if (search) {
      // Find matching organizations first
      const organizations = await Organization.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const organizationIds = organizations.map((org) => org._id);

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { "email.address": { $regex: search, $options: "i" } },
        { "phone.number": { $regex: search, $options: "i" } },
        { organization: { $in: organizationIds } },
      ];
    }

    const leads = await Leads.find(filter)
      .populate("organization", "name website")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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

export const getLeadById = async (req, res) => {
  try {

    const lead = await Leads.findById(req.params.id)
      .populate("owner", "name email")
      .populate("organization");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};

// export const addNote = async (req, res) => {
//   try {

//     const { text } = req.body;

//     const lead = await Leads.findById(req.params.id);

//     lead.notes.push({
//       text,
//       createdBy: req.user.id
//     });

//     await lead.save();
//     // Agar lead kisi organization se linked hai
// if (lead.organization) {

//   const organization = await Organization.findById(
//     lead.organization
//   );

//   if (organization) {

//     organization.notes.push({
//       text,
//       createdBy: req.user.id,
//     });

//     await organization.save();

//   }

// }

// const updated = await Leads.findById(req.params.id)
//   .populate("owner", "name email")
//   .populate("organization")
//   .populate("notes.createdBy", "name");

// res.json(updated);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const deleteNote = async (req, res) => {
//   try {

//     const { noteId } = req.params;

//     const lead = await Leads.findById(req.params.id);

//     lead.notes = lead.notes.filter(
//       n => n._id.toString() !== noteId
//     );

//     await lead.save();

//     res.json(lead);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const updateNote = async (req, res) => {
//   try {

//     const { noteId } = req.params;
//     const { text } = req.body;

//     const lead = await Leads.findById(req.params.id);

//     const note = lead.notes.id(noteId);
    
//     note.text = text;

//     await lead.save();

//     res.json(lead);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const pinNote = async (req, res) => {
//   try {

//     const { noteId } = req.params;

//     const lead = await Leads.findById(req.params.id);

//     if (!lead) {
//       return res.status(404).json({
//         message: "Lead not found",
//       });
//     }

//     const note = lead.notes.id(noteId);

//     if (!note) {
//       return res.status(404).json({
//         message: "Note not found",
//       });
//     }

//     console.log("Clicked Note:", noteId);

//     console.log(
//       "Before:",
//       lead.notes.map((n) => ({
//         id: n._id.toString(),
//         pinned: n.pinned,
//       }))
//     );

//     // Toggle
//     note.pinned = !note.pinned;

//     await lead.save();

//     console.log(
//       "After:",
//       lead.notes.map((n) => ({
//         id: n._id.toString(),
//         pinned: n.pinned,
//       }))
//     );

//     const updatedLead = await Leads.findById(req.params.id)
//       .populate("notes.createdBy", "name")
//       .populate("owner", "name email")
//       .populate("organization");

//     res.json(updatedLead);

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// };

export const linkOrganization = async (req, res) => {
  try {

    const { organizationId } = req.body;

    const lead = await Leads.findByIdAndUpdate(

      req.params.id,

      {
        organization: organizationId,
      },

      {
        new: true,
      }

    )
      .populate("organization")
      .populate("owner", "name email");

    res.json(lead);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

export const transferLeadOwner = async (req, res) => {
  try {

    const { ownerId } = req.body;

    // Update lead
    await Leads.findByIdAndUpdate(
      req.params.id,
      {
        owner: ownerId
      },
      {
        returnDocument: "after" // Mongoose 8
      }
    );

    // Get updated lead with populated owner
    const lead = await Leads.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("organization", "name");

    return res.status(200).json(lead);

  } catch (err) {

    console.error("TRANSFER ERROR:", err);

    return res.status(500).json({
      message: err.message
    });

  }
};