import Organization from "../models/Organization.js";
import Leads from "../models/Leads.js";

// ======================================================
// CREATE ORGANIZATION
// ======================================================

export const createOrganization = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE ORGANIZATION");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("=================================");

    // ------------------------------------------
    // AUTH CHECK
    // ------------------------------------------

    if (!req.user?.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    // ------------------------------------------
    // GET BODY
    // ------------------------------------------

    const {
      name,
      website,
      phone,
      email,
      address,
      currentBookingPalAccount,
      nextListingExpirationDate,
      ecbyoPass,
      pmsUsed,
      totalUnitsManaged,
      unitsOnEcbyo,
      listingId,
      feedDataLink,
    } = req.body;

    // ------------------------------------------
    // NAME VALIDATION
    // ------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }

    // ------------------------------------------
    // BOOKING PAL VALIDATION
    // ------------------------------------------

    const bookingPalValue =
      currentBookingPalAccount || "none";

    if (!["none", "yes", "no"].includes(bookingPalValue)) {
      return res.status(400).json({
        message:
          "Current Booking Pal Account must be none, yes or no",
      });
    }

    // ------------------------------------------
    // CREATE ORGANIZATION
    // ------------------------------------------

    const organization = await Organization.create({
      name: name.trim(),

      website: website?.trim() || "",

      owner: req.user.id,

      phone: phone?.trim() || "",

      email: email?.trim() || "",

      address: address?.trim() || "",

      currentBookingPalAccount: bookingPalValue,

      nextListingExpirationDate:
        nextListingExpirationDate || null,

      ecbyoPass: ecbyoPass || "",

      pmsUsed: pmsUsed?.trim() || "",

      totalUnitsManaged:
        totalUnitsManaged === "" ||
        totalUnitsManaged === null ||
        totalUnitsManaged === undefined
          ? 0
          : Number(totalUnitsManaged),

      unitsOnEcbyo:
        unitsOnEcbyo === "" ||
        unitsOnEcbyo === null ||
        unitsOnEcbyo === undefined
          ? 0
          : Number(unitsOnEcbyo),

      listingId: listingId?.trim() || "",

      feedDataLink: feedDataLink?.trim() || "",

      // ------------------------------------------
      // IMPORTANT
      // ------------------------------------------
      // Facebook / LinkedIn form se nahi aa rahe,
      // isliye create ke time empty rahenge.

      facebook: "",

      linkedin: "",

      leads: [],

      notes: [],
    });

    // ------------------------------------------
    // POPULATE RESPONSE
    // ------------------------------------------

    const populatedOrganization =
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

    console.log(
      "Organization created:",
      populatedOrganization._id
    );

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(201).json(
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

    return res.status(500).json({
      message: error.message,
      error: error.name,
    });
  }
};


// ======================================================
// GET ALL ORGANIZATIONS
// ======================================================

export const getOrganizations = async (req, res) => {
  try {
    const {
      search,
      userId,
    } = req.query;

    const filter = {};

    // ------------------------------------------
    // OWNER FILTER
    // ------------------------------------------

    if (
      userId &&
      userId !== "all"
    ) {
      filter.owner = userId;
    }

    // ------------------------------------------
    // SEARCH
    // ------------------------------------------

    if (search?.trim()) {
      const regex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
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
          phone: regex,
        },
        {
          address: regex,
        },
        {
          pmsUsed: regex,
        },
        {
          listingId: regex,
        },
      ];
    }

    // ------------------------------------------
    // FETCH
    // ------------------------------------------

    const organizations =
      await Organization.find(filter)
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone organization"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(
      organizations
    );

  } catch (error) {
    console.error(
      "GET ORGANIZATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// GET SINGLE ORGANIZATION
// ======================================================

export const getOrganizationById = async (
  req,
  res
) => {
  try {
    const organization =
      await Organization.findById(
        req.params.id
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone organization title"
        )
        .populate({
          path: "leads",
          populate: {
            path: "owner",
            select: "name email role",
          },
        });

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    return res.json(
      organization
    );

  } catch (error) {
    console.error(
      "GET ORGANIZATION ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// UPDATE ORGANIZATION
// ======================================================

export const updateOrganization = async (
  req,
  res
) => {
  try {

    // ------------------------------------------
    // DON'T ALLOW OWNER TO BE ACCIDENTALLY
    // CHANGED FROM NORMAL EDIT
    // ------------------------------------------

    const allowedFields = [
      "name",
      "website",
      "phone",
      "email",
      "address",
      "currentBookingPalAccount",
      "nextListingExpirationDate",
      "ecbyoPass",
      "pmsUsed",
      "totalUnitsManaged",
      "unitsOnEcbyo",
      "listingId",
      "feedDataLink",
      "facebook",
      "linkedin",
    ];

    const updateData = {};

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !== undefined
        ) {
          updateData[field] =
            req.body[field];
        }
      }
    );

    // ------------------------------------------
    // BOOKING PAL VALIDATION
    // ------------------------------------------

    if (
      updateData.currentBookingPalAccount &&
      !["none", "yes", "no"].includes(
        updateData.currentBookingPalAccount
      )
    ) {
      return res.status(400).json({
        message:
          "Current Booking Pal Account must be none, yes or no",
      });
    }

    // ------------------------------------------
    // NUMBER FIELDS
    // ------------------------------------------

    if (
      updateData.totalUnitsManaged !==
        undefined
    ) {
      updateData.totalUnitsManaged =
        Number(
          updateData.totalUnitsManaged || 0
        );
    }

    if (
      updateData.unitsOnEcbyo !==
        undefined
    ) {
      updateData.unitsOnEcbyo =
        Number(
          updateData.unitsOnEcbyo || 0
        );
    }

    // ------------------------------------------
    // UPDATE
    // ------------------------------------------

    const organization =
      await Organization.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "leads",
          "name email phone organization"
        );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    return res.json(
      organization
    );

  } catch (error) {
    console.error(
      "UPDATE ORGANIZATION ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// DELETE ORGANIZATION
// ======================================================

export const deleteOrganization = async (
  req,
  res
) => {
  try {

    const organization =
      await Organization.findByIdAndDelete(
        req.params.id
      );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    // ------------------------------------------
    // REMOVE ORGANIZATION FROM ALL LEADS
    // ------------------------------------------

    await Leads.updateMany(
      {
        organization:
          organization._id,
      },
      {
        $unset: {
          organization: "",
        },
      }
    );

    return res.json({
      message:
        "Organization deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ORGANIZATION ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// ADD LEAD TO ORGANIZATION
// ======================================================

export const addLeadToOrganization = async (
  req,
  res
) => {
  try {

    const {
      leadId,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!leadId) {
      return res.status(400).json({
        message:
          "Lead ID is required",
      });
    }

    // ------------------------------------------
    // ORGANIZATION
    // ------------------------------------------

    const organization =
      await Organization.findById(
        req.params.id
      );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    // ------------------------------------------
    // LEAD
    // ------------------------------------------

    const lead =
      await Leads.findById(
        leadId
      );

    if (!lead) {
      return res.status(404).json({
        message:
          "Lead not found",
      });
    }

    // ------------------------------------------
    // IF LEAD ALREADY BELONGS TO ANOTHER
    // ORGANIZATION, REMOVE IT THERE FIRST
    // ------------------------------------------

    if (
      lead.organization &&
      lead.organization.toString() !==
        organization._id.toString()
    ) {
      await Organization.findByIdAndUpdate(
        lead.organization,
        {
          $pull: {
            leads: lead._id,
          },
        }
      );
    }

    // ------------------------------------------
    // LINK LEAD
    // ------------------------------------------

    lead.organization =
      organization._id;

    await lead.save();

    // ------------------------------------------
    // ADD TO ORGANIZATION
    // WITHOUT DUPLICATE
    // ------------------------------------------

    await Organization.findByIdAndUpdate(
      organization._id,
      {
        $addToSet: {
          leads: lead._id,
        },
      }
    );

    // ------------------------------------------
    // RETURN UPDATED ORGANIZATION
    // ------------------------------------------

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
          "name email phone organization title"
        );

    return res.json(
      updatedOrganization
    );

  } catch (error) {

    console.error(
      "ADD LEAD TO ORGANIZATION ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// REMOVE LEAD FROM ORGANIZATION
// ======================================================

export const removeLeadFromOrganization = async (
  req,
  res
) => {
  try {

    const {
      leadId,
    } = req.body;

    // ------------------------------------------
    // ORGANIZATION
    // ------------------------------------------

    const organization =
      await Organization.findById(
        req.params.id
      );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    // ------------------------------------------
    // REMOVE FROM ORGANIZATION
    // ------------------------------------------

    await Organization.findByIdAndUpdate(
      organization._id,
      {
        $pull: {
          leads: leadId,
        },
      }
    );

    // ------------------------------------------
    // REMOVE FROM LEAD
    // ------------------------------------------

    await Leads.findByIdAndUpdate(
      leadId,
      {
        $unset: {
          organization: "",
        },
      }
    );

    // ------------------------------------------
    // RETURN UPDATED ORGANIZATION
    // ------------------------------------------

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
          "name email phone organization title"
        );

    return res.json(
      updatedOrganization
    );

  } catch (error) {

    console.error(
      "REMOVE LEAD ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// TRANSFER ORGANIZATION OWNER
// ======================================================

export const transferOrganizationOwner = async (
  req,
  res
) => {
  try {

    const {
      ownerId,
    } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        message:
          "Owner ID is required",
      });
    }

    const organization =
      await Organization.findByIdAndUpdate(
        req.params.id,
        {
          owner: ownerId,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "owner",
        "name email role"
      );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    return res.json(
      organization
    );

  } catch (error) {

    console.error(
      "TRANSFER ORGANIZATION OWNER ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// ADD ORGANIZATION NOTE
// ======================================================

export const addOrganizationNote = async (
  req,
  res
) => {
  try {

    const {
      text,
    } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message:
          "Note text is required",
      });
    }

    const organization =
      await Organization.findById(
        req.params.id
      );

    if (!organization) {
      return res.status(404).json({
        message:
          "Organization not found",
      });
    }

    // ------------------------------------------
    // ADD NOTE TO ORGANIZATION
    // ------------------------------------------

    organization.notes.push({
      text: text.trim(),
      createdBy: req.user.id,
    });

    await organization.save();

    // ------------------------------------------
    // ALSO ADD NOTE TO LINKED LEADS
    // ------------------------------------------

    const leads =
      await Leads.find({
        organization:
          organization._id,
      });

    for (const lead of leads) {

      if (!Array.isArray(lead.notes)) {
        lead.notes = [];
      }

      lead.notes.push({
        text: text.trim(),
        createdBy: req.user.id,
      });

      await lead.save();
    }

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    const updatedOrganization =
      await Organization.findById(
        organization._id
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "notes.createdBy",
          "name email"
        )
        .populate(
          "leads",
          "name email phone organization"
        );

    return res.json(
      updatedOrganization
    );

  } catch (error) {

    console.error(
      "ADD ORGANIZATION NOTE ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};