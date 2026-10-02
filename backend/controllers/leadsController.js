import Leads from "../models/Leads.js";
import Organization from "../models/Organization.js";

// Add leads Data
export const createLeads = async (req, res) => {
  try {
    const lead = await Leads.create({
      ...req.body,
      owner: req.user.id,
      organization: req.body.organization,
    });

    if (req.body.organization) {
      await Organization.findByIdAndUpdate(req.body.organization, {
        $addToSet: {
          leads: lead._id,
        },
      });
    }

    const populatedLead = await Leads.findById(lead._id)
      .populate("owner", "name email role")
      .populate(
        "organization",
        "name website email phone industry vrsUsed vrsId monthsOfCredit totalUnitsManaged address",
      );

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

    // Dropdown me selected user ke leads
    if (userId) {
      filter.owner = userId;
    }

    if (search?.trim()) {
      const searchValue = search.trim();

      const organizations = await Organization.find({
        name: {
          $regex: searchValue,
          $options: "i",
        },
      }).select("_id");

      const organizationIds = organizations.map(
        (org) => org._id
      );

      filter.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { title: { $regex: searchValue, $options: "i" } },
        {
          "email.address": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "phone.number": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          organization: {
            $in: organizationIds,
          },
        },
        {
          website: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          instagram: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          facebook: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    console.log("GET LEADS QUERY:", req.query);
    console.log("GET LEADS FILTER:", filter);

    const leads = await Leads.find(filter)
      .populate("organization", "name website")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    console.log("LEADS FOUND:", leads.length);

    res.json(leads);
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// update leads

// ==========================================
// UPDATE LEAD
// ==========================================

export const updateLeads = async (req, res) => {
  try {
    const leadId = req.params.id;

    // ==========================================
    // FIND OLD LEAD
    // ==========================================

    const oldLead = await Leads.findById(leadId);

    if (!oldLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // ==========================================
    // OLD ORGANIZATION
    // ==========================================

    const oldOrganizationId = oldLead.organization
      ? oldLead.organization.toString()
      : null;

    // ==========================================
    // CHECK WHETHER ORGANIZATION IS BEING UPDATED
    // ==========================================

    const organizationChanged = Object.prototype.hasOwnProperty.call(
      req.body,
      "organization",
    );

    let newOrganizationId = oldOrganizationId;

    if (organizationChanged) {
      newOrganizationId = req.body.organization
        ? req.body.organization.toString()
        : null;
    }

    // ==========================================
    // VALIDATE NEW ORGANIZATION
    // ==========================================

    if (organizationChanged && newOrganizationId) {
      const newOrganization = await Organization.findById(newOrganizationId);

      if (!newOrganization) {
        return res.status(404).json({
          message: "Organization not found",
        });
      }
    }

    // ==========================================
    // UPDATE LEAD
    // ==========================================

    const lead = await Leads.findByIdAndUpdate(leadId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // ==========================================
    // ORGANIZATION RELATIONSHIP SYNC
    // ==========================================

    if (organizationChanged && oldOrganizationId !== newOrganizationId) {
      // ========================================
      // REMOVE FROM OLD ORGANIZATION
      // ========================================

      if (oldOrganizationId) {
        await Organization.findByIdAndUpdate(oldOrganizationId, {
          $pull: {
            leads: leadId,
          },
        });
      }

      // ========================================
      // ADD TO NEW ORGANIZATION
      // ========================================

      if (newOrganizationId) {
        await Organization.findByIdAndUpdate(newOrganizationId, {
          $addToSet: {
            leads: leadId,
          },
        });
      }
    }

    // ==========================================
    // RETURN FULLY POPULATED LEAD
    // ==========================================

    const populatedLead = await Leads.findById(leadId)
      .populate("owner", "name email role")
      .populate(
        "organization",
        "name website email phone industry vrsUsed vrsId monthsOfCredit totalUnitsManaged address",
      );

    res.json(populatedLead);
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// delete leads
export const deleteLeads = async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // Remove lead from organization
    if (lead.organization) {
      await Organization.findByIdAndUpdate(lead.organization, {
        $pull: {
          leads: lead._id,
        },
      });
    }

    // Delete lead
    await Leads.findByIdAndDelete(req.params.id);

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBulkLeads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No leads selected.",
      });
    }

    const leads = await Leads.find({
      _id: { $in: ids },
    }).select("_id organization");

    if (!leads.length) {
      return res.status(404).json({
        message: "No leads found.",
      });
    }

    const organizationIds = [
      ...new Set(
        leads
          .filter((lead) => lead.organization)
          .map((lead) => lead.organization.toString())
      ),
    ];

    if (organizationIds.length > 0) {
      await Organization.updateMany(
        {
          _id: { $in: organizationIds },
        },
        {
          $pull: {
            leads: {
              $in: leads.map((lead) => lead._id),
            },
          },
        }
      );
    }

    await Leads.deleteMany({
      _id: { $in: ids },
    });

    return res.json({
      message: `${leads.length} leads deleted successfully.`,
      deletedCount: leads.length,
    });
  } catch (error) {
    console.error("BULK DELETE LEADS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id)
      .populate("owner", "name email role")
      .populate(
        "organization",
        "name website email phone industry vrsUsed vrsId monthsOfCredit totalUnitsManaged address",
      );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch (err) {
    console.error("GET LEAD ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
 
export const linkOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const leadId = req.params.id;

    // ========================================
    // FIND LEAD
    // ========================================

    const lead = await Leads.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // ========================================
    // FIND NEW ORGANIZATION
    // ========================================

    const newOrganization = await Organization.findById(organizationId);

    if (!newOrganization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // ========================================
    // OLD ORGANIZATION
    // ========================================

    const oldOrganizationId = lead.organization
      ? lead.organization.toString()
      : null;

    // ========================================
    // REMOVE FROM OLD ORGANIZATION
    // ========================================

    if (oldOrganizationId && oldOrganizationId !== organizationId) {
      await Organization.findByIdAndUpdate(oldOrganizationId, {
        $pull: {
          leads: leadId,
        },
      });
    }

    // ========================================
    // UPDATE LEAD
    // ========================================

    lead.organization = newOrganization._id;

    await lead.save();

    // ========================================
    // ADD TO NEW ORGANIZATION
    // ========================================

    await Organization.findByIdAndUpdate(newOrganization._id, {
      $addToSet: {
        leads: leadId,
      },
    });

    // ========================================
    // RETURN UPDATED LEAD
    // ========================================

    const updatedLead = await Leads.findById(leadId)
      .populate(
        "organization",
        "name website email phone industry vrsUsed vrsId monthsOfCredit totalUnitsManaged address",
      )
      .populate("owner", "name email role");

    res.json(updatedLead);
  } catch (err) {
    console.error("LINK ORGANIZATION ERROR:", err);

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
        owner: ownerId,
      },
      {
        returnDocument: "after", // Mongoose 8
      },
    );

    // Get updated lead with populated owner
    const lead = await Leads.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("organization", "name");

    return res.status(200).json(lead);
  } catch (err) {
    console.error("TRANSFER ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
