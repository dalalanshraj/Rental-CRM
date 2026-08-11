import Organization from "../models/Organization.js";
import Leads from "../models/Leads.js";


// CREATE ORGANIZATION
export const createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create({
      ...req.body,
      owner: req.user.id
    });

    const populatedOrganization = await Organization.findById(
      organization._id
    )
      .populate("owner", "name email role")
      .populate("leads", "name email phone");

    res.status(201).json(populatedOrganization);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORGANIZATIONS
// GET ALL ORGANIZATIONS
export const getOrganizations = async (req, res) => {
  try {
    const { search, userId } = req.query;

    let filter = {};

    // ==========================================
    // OWNER FILTER
    // ==========================================

    if (userId) {
      filter.owner = userId;
    }

    // ==========================================
    // SEARCH FILTER
    // ==========================================

    if (search?.trim()) {
      const regex = new RegExp(
        search.trim(),
        "i"
      );

      const searchConditions = [
        {
          name: regex,
        },
        {
          website: regex,
        },
        {
          email: regex,
        },
        {
          industry: regex,
        },
      ];

      // phone NUMBER hai, isliye regex nahi
      const numericSearch =
        search.replace(/\D/g, "");

      if (numericSearch) {
        searchConditions.push({
          phone: Number(numericSearch),
        });
      }

      filter.$or = searchConditions;
    }

    // ==========================================
    // GET ORGANIZATIONS
    // ==========================================

    const organizations =
      await Organization.find(filter)
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        });

    res.json(organizations);

  } catch (error) {
    console.error(
      "Get organizations error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE ORGANIZATION
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("leads", "name email phone organization")
      .populate({
        path: "leads",
        populate: {
          path: "owner",
          select: "name email"
        }
      });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    res.json(organization);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORGANIZATION
export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("owner", "name email role")
      .populate("leads", "name email phone");

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    res.json(organization);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ORGANIZATION
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(
      req.params.id
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    // remove organization from linked leads
    await Leads.updateMany(
      { organization: organization._id },
      {
        $unset: {
          organization: ""
        }
      }
    );

    res.json({
      message: "Organization deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD LEAD TO ORGANIZATION
export const addLeadToOrganization = async (req, res) => {
  try {

    console.log("Organization ID:", req.params.id);
    console.log("Lead ID:", req.body.leadId);

    const { leadId } = req.body;

    const organization = await Organization.findById(req.params.id);
    console.log("Organization:", organization);

    const lead = await Leads.findById(leadId);
    console.log("Lead:", lead);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update lead
    lead.organization = organization._id;
    await lead.save();

    // Prevent duplicate
    const exists = organization.leads.some(
      (id) => id.toString() === lead._id.toString()
    );

    if (!exists) {
      organization.leads.push(lead._id);
      await organization.save();
    }

    const updatedOrganization = await Organization.findById(
      organization._id
    )
      .populate("owner", "name email role")
      .populate("leads", "name email phone organization");

    res.json(updatedOrganization);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// REMOVE LEAD FROM ORGANIZATION
export const removeLeadFromOrganization = async (req, res) => {
  try {
    const { leadId } = req.body;

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    organization.leads = organization.leads.filter(
      (lead) => lead.toString() !== leadId
    );

    await organization.save();

    await Leads.findByIdAndUpdate(leadId, {
      $unset: {
        organization: ""
      }
    });

    const updatedOrganization = await Organization.findById(
      organization._id
    )
      .populate("owner", "name email role")
      .populate("leads", "name email phone");

    res.json(updatedOrganization);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const transferOrganizationOwner = async (req, res) => {
  try {

    const { ownerId } = req.body;

    await Organization.findByIdAndUpdate(
      req.params.id,
      {
        owner: ownerId,
      },
      {
        returnDocument: "after",
      }
    );

    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email role");

    res.json(organization);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const addOrganizationNote = async (req, res) => {
  try {

    const { text } = req.body;

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // Organization me note add
    organization.notes.push({
      text,
      createdBy: req.user.id,
    });

    await organization.save();

    // Linked leads me bhi same note add
    const leads = await Leads.find({
      organization: organization._id,
    });

    for (const lead of leads) {

      lead.notes.push({
        text,
        createdBy: req.user.id,
      });

      await lead.save();

    }

    const updatedOrganization =
      await Organization.findById(organization._id)
        .populate("notes.createdBy", "name");

    res.json(updatedOrganization);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};