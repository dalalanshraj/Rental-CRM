import Leads from "../models/Leads.js";
import Activity from "../models/Activity.js";

export const createActivity = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      dueDate,
      startTime,
     
      lead,
      organization,
      status,
    } = req.body;

    // =========================================
    // CREATE REMINDER DATE + TIME
    // =========================================

    let reminderAt = null;

if (dueDate && startTime) {
  const [hours, minutes] = startTime.split(":");

  reminderAt = new Date(dueDate);

  reminderAt.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (type === "email") {
    reminderAt.setHours(
      reminderAt.getHours() - 1
    );
  }
}
    // let reminderAt = null;

    // if (dueDate && startTime) {
    //   const [hours, minutes] = startTime.split(":");

    //   reminderAt = new Date(dueDate);

    //   reminderAt.setHours(
    //     Number(hours),
    //     Number(minutes),
    //     0,
    //     0
    //   );
    // }

    // =========================================
    // CREATE ACTIVITY
    // =========================================

    const activity = await Activity.create({
      title,
      type,
      description,
      dueDate,
      startTime,
    

      lead: lead || null,

      organization: organization || null,

      owner: req.user.id,

      status: status || "pending",

      reminderAt,

      reminderSent: false,
    });

    // =========================================
    // ADD ACTIVITY TO LEAD
    // =========================================

    if (lead) {
      await Leads.findByIdAndUpdate(
        lead,
        {
          $push: {
            activities: activity._id,
          },
        }
      );
    }

    // =========================================
    // POPULATE
    // =========================================

    const populated =
      await Activity.findById(activity._id)
        .populate("owner", "name email")
        .populate("lead", "name")
        .populate("organization", "name");

    res.status(201).json(populated);

  } catch (error) {
    console.error(
      "Create activity error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
 
export const getActivities = async (req, res) => {
  try {
    const {
      leadId,
      organizationId,
      userId,
      status,
      period,
    } = req.query;

    let filter = {};

    // =====================================================
    // OWNER FILTER
    // =====================================================

    if (userId && userId !== "all") {
      filter.owner = userId;
    }

    // =====================================================
    // LEAD FILTER
    // =====================================================

    if (leadId) {
      filter.lead = leadId;
    }

    // =====================================================
    // ORGANIZATION FILTER
    // =====================================================

    if (organizationId) {
      filter.organization = organizationId;
    }

    // =====================================================
    // STATUS FILTER
    // =====================================================

    if (status) {
      filter.status = status;
    }

    // =====================================================
    // ACTIVITIES
    // =====================================================

    const activities = await Activity.find(filter)
      .populate("owner", "name email")
      .populate(
        "lead",
        "name email phone website organization"
      )
      .populate(
        "organization",
        "name email phone website"
      )
      .sort({
        dueDate: 1,
        startTime: 1,
      })
      .lean();

    res.json(activities);

  } catch (error) {
    console.error(
      "Get activities error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(
      req.params.id
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    const {
      title,
      type,
      description,
      dueDate,
      startTime,
      lead,
      organization,
      status,
    } = req.body;

    // =========================================
    // CALCULATE NEW REMINDER TIME
    // =========================================
let reminderAt = null;

if (dueDate && startTime) {
  const [hours, minutes] = startTime.split(":");

  reminderAt = new Date(dueDate);

  reminderAt.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (type === "email") {
    reminderAt.setHours(
      reminderAt.getHours() - 1
    );
  }
}
    // let reminderAt = null;

    // if (dueDate && startTime) {
    //   const [hours, minutes] =
    //     startTime.split(":");

    //   reminderAt = new Date(dueDate);

    //   reminderAt.setHours(
    //     Number(hours),
    //     Number(minutes),
    //     0,
    //     0
    //   );
    // }

    // =========================================
    // UPDATE ACTIVITY
    // =========================================

    activity.title =
      title ?? activity.title;

    activity.type =
      type ?? activity.type;

    activity.description =
      description ?? activity.description;

    activity.dueDate =
      dueDate ?? activity.dueDate;

    activity.startTime =
      startTime ?? activity.startTime;

    activity.lead =
      lead || null;

    activity.organization =
      organization || null;

    activity.status =
      status || "pending";

    activity.reminderAt =
      reminderAt;

    // =========================================
    // IMPORTANT
    // New date/time means new reminder
    // =========================================

    activity.reminderSent = false;

    // If completed, don't schedule reminder
    if (activity.status === "completed") {
      activity.reminderAt = null;
      activity.reminderSent = true;
    }

    await activity.save();

    // =========================================
    // POPULATE
    // =========================================

    const updated =
      await Activity.findById(activity._id)
        .populate("owner", "name email")
        .populate("lead", "name")
        .populate("organization", "name");

    res.json(updated);

  } catch (error) {

    console.error(
      "Update activity error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteActivity = async (
  req,
  res
) => {
  try {

    const activity =
      await Activity.findById(
        req.params.id
      );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // Remove from Lead
    if (activity.lead) {

      await Leads.findByIdAndUpdate(
        activity.lead,
        {
          $pull: {
            activities:
              activity._id,
          },
        }
      );

    }

    // Delete activity
    await activity.deleteOne();

    res.json({
      message:
        "Activity deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete activity error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const completeActivity = async (
  req,
  res
) => {
  try {
    const activity =
      await Activity.findById(
        req.params.id
      );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // =========================================
    // PENDING → COMPLETED
    // =========================================

    if (activity.status === "pending") {

      activity.status = "completed";

      activity.completedAt =
        new Date();

      // Cancel reminder
      activity.reminderAt = null;

      activity.reminderSent = true;

    }

    // =========================================
    // COMPLETED → PENDING
    // =========================================

    else {

      activity.status = "pending";

      activity.completedAt = null;

      // Re-create reminder
      if (
        activity.dueDate &&
        activity.startTime
      ) {
        const [
          hours,
          minutes,
        ] =
          activity.startTime.split(":");

        const reminderAt =
          new Date(
            activity.dueDate
          );

        reminderAt.setHours(
          Number(hours),
          Number(minutes),
          0,
          0
        );

        activity.reminderAt =
          reminderAt;

        activity.reminderSent =
          false;

      }
    }

    await activity.save();

    const updated =
      await Activity.findById(
        activity._id
      )
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "lead",
          "name"
        )
        .populate(
          "organization",
          "name"
        );

    res.json(updated);

  } catch (error) {

    console.error(
      "Complete activity error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};