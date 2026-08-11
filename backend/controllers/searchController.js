import Lead from "../models/Leads.js";
import Deal from "../models/Deals.js";
import Organization from "../models/Organization.js";

export const globalSearch = async (req, res) => {
  try {
    const search = req.query.q?.trim();

    if (!search) {
      return res.json([]);
    }

    const regex = new RegExp(search, "i");

    // =====================================================
    // 1. FIND MATCHING ORGANIZATIONS
    // =====================================================

    const organizationOr = [
      {
        name: regex,
      },
      {
        website: regex,
      },
      {
        email: regex,
      },
    ];

    // Organization phone is NUMBER
    const numericSearch = search.replace(/\D/g, "");

    if (numericSearch) {
      organizationOr.push({
        phone: Number(numericSearch),
      });
    }

    const matchingOrganizations =
      await Organization.find({
        $or: organizationOr,
      })
        .select("_id name website email phone")
        .limit(20)
        .lean();

    // =====================================================
    // ORGANIZATION IDS
    // =====================================================

    const organizationIds =
      matchingOrganizations.map(
        (organization) => organization._id
      );

    // =====================================================
    // 2. SEARCH LEADS
    // =====================================================

    const leadOr = [
      // Name
      {
        name: regex,
      },

      // Email
      {
        "email.address": regex,
      },

      // Phone
      {
        "phone.number": regex,
      },

      // Website
      {
        website: regex,
      },

      // Instagram
      {
        instagram: regex,
      },

      // Facebook
      {
        facebook: regex,
      },

      // Title
      {
        title: regex,
      },
    ];

    // Add organization search only
    // if matching organizations were found

    if (organizationIds.length > 0) {
      leadOr.push({
        organization: {
          $in: organizationIds,
        },
      });
    }

    const leads = await Lead.find({
      $or: leadOr,
    })
      .populate(
        "organization",
        "name website"
      )
      .select(
        "name email phone website instagram facebook title organization"
      )
      .limit(20)
      .lean();

    // =====================================================
    // 3. SEARCH DEALS
    // =====================================================

    const dealOr = [
      {
        title: regex,
      },

      {
        name: regex,
      },
    ];

    // Agar Deal mein email/phone same structure hai
    // tab ye fields search hongi

    dealOr.push(
      {
        "email.address": regex,
      },
      {
        "phone.number": regex,
      }
    );

    const deals = await Deal.find({
      $or: dealOr,
    })
      .select(
        "title name email phone"
      )
      .limit(20)
      .lean();

    // =====================================================
    // 4. COMBINE ALL RESULTS
    // =====================================================

    const results = [
      // LEADS
      ...leads.map((lead) => ({
        ...lead,
        type: "lead",
      })),

      // DEALS
      ...deals.map((deal) => ({
        ...deal,
        type: "deal",
      })),

      // ORGANIZATIONS
      ...matchingOrganizations.map(
        (organization) => ({
          ...organization,
          type: "organization",
        })
      ),
    ];

    // =====================================================
    // 5. RETURN
    // =====================================================

    res.json(results);

  } catch (error) {
    console.error(
      "GLOBAL SEARCH ERROR:",
      error
    );

    res.status(500).json({
      message: "Global search failed",
      error: error.message,
    });
  }
};