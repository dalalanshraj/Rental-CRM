import Lead from "../models/Leads.js";
import Organization from "../models/Organization.js";

export const globalSearch = async (req, res) => {
  try {
    const search = req.query.q?.trim();

    if (!search) {
      return res.json([]);
    }

    // ==========================================
    // ESCAPE REGEX SPECIAL CHARACTERS
    // ==========================================

    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

     `804e=]
     '
     /9897665`
    const regex = new RegExp(escapedSearch, "i");

    // ==========================================
    // ORGANIZATION SEARCH
    // ==========================================

    const organizationQuery = {
      $or: [
        { name: regex },
        { website: regex }, 
        { email: regex },
      ],
    };

    // Phone search
    const numericSearch = search.replace(/\D/g, "");

    if (numericSearch) {
      organizationQuery.$or.push({
        phone: new RegExp(`^${numericSearch}`),
      });
    }

    // ==========================================
    // RUN ORGANIZATION SEARCH
    // ==========================================

    const matchingOrganizations = await Organization.find(
      organizationQuery
    )
      .select("_id name website email phone")
      .limit(10)
      .lean();

    // ==========================================
    // ORGANIZATION IDS
    // ==========================================

    const organizationIds = matchingOrganizations.map(
      (organization) => organization._id
    );

    // ==========================================
    // LEAD SEARCH
    // ==========================================

    const leadOr = [
      { name: regex },
      { "email.address": regex },
      { "phone.number": regex },
      { website: regex },
      { instagram: regex },
      { facebook: regex },
      { title: regex },
    ];

    if (organizationIds.length > 0) {
      leadOr.push({
        organization: {
          $in: organizationIds,
        },
      });
    }

    // ==========================================
    // LEAD QUERY
    // ==========================================

    const leads = await Lead.find({
      $or: leadOr,
    })
      .select(
        "_id name email phone website instagram facebook title organization"
      )
      .populate("organization", "name website")
      .limit(10)
      .lean();

    // ==========================================
    // FORMAT RESULTS
    // ==========================================

    const results = [
      ...leads.map((lead) => ({
        ...lead,
        type: "lead",
      })),

      ...matchingOrganizations.map((organization) => ({
        ...organization,
        type: "organization",
      })),
    ];

    // ==========================================
    // RETURN
    // ==========================================

    return res.json(results);

  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error);

    return res.status(500).json({
      message: "Global search failed",
      error: error.message,
    });
  }
};