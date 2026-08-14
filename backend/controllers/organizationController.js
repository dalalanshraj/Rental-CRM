import Organization from "../models/Organization.js";
import Leads from "../models/Leads.js";


// ==========================================
// CREATE ORGANIZATION
// ==========================================

export const createOrganization = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE ORGANIZATION");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("=================================");

    if (!req.user?.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const {
      name,
      website,
      email,
      phone,
      industry,
      vrsUsed,
      vrsId,
      monthsOfCredit,
      totalUnitsManaged,
      address,
      notes,
    } = req.body;

    // Name required
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }

    const organization = await Organization.create({
      name: name.trim(),

      website: website || "",

      email: email || "",

      phone: phone || "",

      industry: industry || "",

      vrsUsed: vrsUsed || "",

      vrsId: vrsId || "",

      monthsOfCredit:
        monthsOfCredit === "" ||
        monthsOfCredit === null ||
        monthsOfCredit === undefined
          ? 0
          : Number(monthsOfCredit),

      totalUnitsManaged:
        totalUnitsManaged === "" ||
        totalUnitsManaged === null ||
        totalUnitsManaged === undefined
          ? 0
          : Number(totalUnitsManaged),

      address: address || {},

      owner: req.user.id,

      // agar schema me notes array hai
      notes: notes || [],
    });

    const populatedOrganization =
      await Organization.findById(organization._id)
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone"
        );

    console.log(
      "Organization created:",
      populatedOrganization._id
    );

    res.status(201).json(
      populatedOrganization
    );

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "CREATE ORGANIZATION ERROR:"
    );

    console.error(error);

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "NAME:",
      error.name
    );

    console.error(
      "================================="
    );

    res.status(500).json({
      message: error.message,
      error: error.name,
    });
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
// ==========================================
// ADD / MOVE LEAD TO ORGANIZATION
// ==========================================

export const addLeadToOrganization = async (
  req,
  res
) => {
  try {

    const { leadId } = req.body;
    const organizationId = req.params.id;

    // ========================================
    // VALIDATE LEAD
    // ========================================

    if (!leadId) {
      return res.status(400).json({
        message: "Lead ID is required",
      });
    }

    // ========================================
    // FIND ORGANIZATION
    // ========================================

    const organization =
      await Organization.findById(
        organizationId
      );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // ========================================
    // FIND LEAD
    // ========================================

    const lead =
      await Leads.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // ========================================
    // OLD ORGANIZATION
    // ========================================

    const oldOrganizationId =
      lead.organization
        ? lead.organization.toString()
        : null;

    // ========================================
    // REMOVE FROM OLD ORGANIZATION
    // ========================================

    if (
      oldOrganizationId &&
      oldOrganizationId !==
        organizationId
    ) {

      await Organization.findByIdAndUpdate(
        oldOrganizationId,
        {
          $pull: {
            leads: leadId,
          },
        }
      );

    }

    // ========================================
    // UPDATE LEAD
    // ========================================

    lead.organization =
      organization._id;

    await lead.save();

    // ========================================
    // ADD TO NEW ORGANIZATION
    // ========================================

    await Organization.findByIdAndUpdate(
      organization._id,
      {
        $addToSet: {
          leads: leadId,
        },
      }
    );

    // ========================================
    // RETURN UPDATED ORGANIZATION
    // ========================================

    const updatedOrganization =
      await Organization.findById(
        organization._id
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone organization"
        );

    res.json(updatedOrganization);

  } catch (error) {

    console.error(
      "ADD LEAD TO ORGANIZATION ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
// REMOVE LEAD FROM ORGANIZATION
export const removeLeadFromOrganization = async (req, res) => {
  try {

    const { leadId } = req.body;

    const organization =
      await Organization.findById(
        req.params.id
      );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    // Remove from organization
    await Organization.findByIdAndUpdate(
      organization._id,
      {
        $pull: {
          leads: leadId
        }
      }
    );

    // Remove organization from lead
    await Leads.findByIdAndUpdate(
      leadId,
      {
        $unset: {
          organization: ""
        }
      }
    );

    const updatedOrganization =
      await Organization.findById(
        organization._id
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone organization"
        );

    res.json(updatedOrganization);

  } catch (error) {

    console.error(
      "REMOVE LEAD FROM ORGANIZATION ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
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