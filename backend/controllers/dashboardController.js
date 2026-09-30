import Leads from "../models/Leads.js";
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

    const isAdmin =
      role === "admin" || role === "superadmin";

    const leadFilter = isAdmin
      ? {}
      : { owner: userId };

    const organizationFilter = isAdmin
      ? {}
      : { owner: userId };

    const activityFilter = isAdmin
      ? {}
      : { owner: userId };

    // =========================================
    // DEBUG
    // =========================================

    console.log("=================================");
    console.log("DASHBOARD USER:", req.user);
    console.log("USER ID:", userId);
    console.log("ROLE:", role);
    console.log("IS ADMIN:", isAdmin);
    console.log("LEAD FILTER:", leadFilter);
    console.log("ORGANIZATION FILTER:", organizationFilter);
    console.log("ACTIVITY FILTER:", activityFilter);

    // =========================================
    // COUNTS
    // =========================================

    const totalLeads =
      await Leads.countDocuments(leadFilter);

    const totalOrganizations =
      await Organization.countDocuments(
        organizationFilter
      );

    const totalActivities =
      await Activity.countDocuments(
        activityFilter
      );

    console.log("TOTAL LEADS:", totalLeads);
    console.log(
      "TOTAL ORGANIZATIONS:",
      totalOrganizations
    );
    console.log(
      "TOTAL ACTIVITIES:",
      totalActivities
    );

    // =========================================
    // MONTHLY LEADS - LAST 12 MONTHS
    // =========================================

    const monthlyLeads = await Leads.aggregate([
      {
        $match: leadFilter,
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          leads: {
            $sum: 1,
          },
        },
      },
    ]);

    // =========================================
    // MONTH NAMES
    // =========================================

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // =========================================
    // CREATE LAST 12 MONTHS
    // =========================================

    const now = new Date();

    const monthlyData = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const found = monthlyLeads.find(
        (item) =>
          item._id.year === year &&
          item._id.month === month
      );

      monthlyData.push({
        month: monthNames[month - 1],
        leads: found ? found.leads : 0,
      });
    }

    // =========================================
    // LEAD STATUS
    // =========================================

    const leadStatus = await Leads.aggregate([
      {
        $match: leadFilter,
      },
      {
        $group: {
          _id: "$status",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
    ]);

    const leadStatusData = leadStatus.map((item) => ({
      name: item._id || "Unknown",
      value: item.value,
    }));

    // =========================================
    // RECENT ACTIVITIES
    // =========================================

    const recentActivities =
      await Activity.find(activityFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    console.log(
      "RECENT ACTIVITIES:",
      recentActivities
    );

    console.log("=================================");

    // =========================================
    // RESPONSE
    // =========================================

    res.json({
      stats: {
        totalLeads,
        totalOrganizations,
        totalActivities,
      },

      monthlyData,

      leadStatusData,

      recentActivities,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};