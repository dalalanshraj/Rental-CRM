 import Leads from "../models/Leads.js";
import Deals from "../models/Deals.js";
import Organization from "../models/Organization.js";
import Activity from "../models/Activity.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // =========================================
    // ADMIN = ALL DATA
    // SALES = OWN DATA
    // =========================================

    const leadFilter =
      role === "admin"
        ? {}
        : { owner: userId };

    const dealFilter =
      role === "admin"
        ? {}
        : { owner: userId };

    const organizationFilter =
      role === "admin"
        ? {}
        : { owner: userId };

    const activityFilter =
      role === "admin"
        ? {}
        : { owner: userId };

    // =========================================
    // COUNTS
    // =========================================

    const totalLeads =
      await Leads.countDocuments(leadFilter);

    const totalDeals =
      await Deals.countDocuments(dealFilter);

    const totalOrganizations =
      await Organization.countDocuments(
        organizationFilter
      );

    const totalActivities =
      await Activity.countDocuments(
        activityFilter
      );

    // =========================================
    // ACTIVE DEALS
    // =========================================

    const activeDeals =
      await Deals.countDocuments({
        ...dealFilter,
        status: {
          $nin: ["won", "lost"],
        },
      });

    // =========================================
    // RESPONSE
    // =========================================

    res.json({
      stats: {
        totalLeads,
        totalDeals,
        activeDeals,
        totalOrganizations,
        totalActivities,
      },
    });

  } catch (error) {

    console.error(
      "DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });

  }
};