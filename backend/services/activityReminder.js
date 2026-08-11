import cron from "node-cron";

import Activity from "../models/Activity.js";
import transporter from "../config/mailer.js";

const sendActivityReminders = async () => {
  try {
    const now = new Date();

    console.log("🔎 Checking activity reminders:", now.toLocaleString());

    const activities = await Activity.find({
      status: "pending",

      reminderSent: false,

      reminderAt: {
        $lte: now,
      },
    })
      .populate("owner", "name email")
      .populate("lead", "name")
      .populate("organization", "name");

    if (!activities.length) {
      console.log("📭 No reminders due");
      return;
    }

    console.log(`📧 ${activities.length} reminder(s) found`);

    for (const activity of activities) {
      try {
        // =========================================
        // USER EMAIL CHECK
        // =========================================

        if (!activity.owner?.email) {
          console.log("⚠️ No email found for activity:", activity._id);

          continue;
        }

        // =========================================
        // DATE
        // =========================================

        const dateText = new Date(activity.dueDate).toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        );

        // =========================================
        // TIME
        // =========================================

        let timeText = "";

        if (activity.startTime) {
          const [hours, minutes] = activity.startTime.split(":");

          const time = new Date();

          time.setHours(Number(hours), Number(minutes), 0, 0);

          timeText = time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });
        }

        // =========================================
        // RELATED PERSON / ORGANIZATION
        // =========================================

        const relatedName =
          activity.lead?.name || activity.organization?.name || "";

        // =========================================
        // SEND EMAIL
        // =========================================

        await transporter.sendMail({
          from: process.env.EMAIL_USER,

          to: activity.owner.email,

          subject: `Activity reminder: ${activity.title}`,

          html: `
            <div
              style="
                margin:0;
                padding:30px 15px;
                background:#f5f6f8;
                font-family:Arial,Helvetica,sans-serif;
              "
            >

              <div
                style="
                  max-width:620px;
                  margin:0 auto;
                  background:#ffffff;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  overflow:hidden;
                "
              >

                <!-- HEADER -->

                <div
                  style="
                    padding:28px 30px;
                    border-bottom:1px solid #eeeeee;
                  "
                >

                  <div
                    style="
                      font-size:13px;
                      color:#6b7280;
                      margin-bottom:8px;
                    "
                  >
                    Activity reminder
                  </div>

                  <h1
                    style="
                      margin:0;
                      font-size:24px;
                      line-height:1.3;
                      font-weight:600;
                      color:#111827;
                    "
                  >
                    ${activity.title}
                  </h1>

                </div>

                <!-- ACTIVITY DETAILS -->

                <div
                  style="
                    padding:30px;
                  "
                >

                  <!-- DATE + TIME -->

                  <div
                    style="
                      display:inline-block;
                      padding:8px 12px;
                      background:#f3f4f6;
                      border-radius:8px;
                      color:#4b5563;
                      font-size:14px;
                      margin-bottom:24px;
                    "
                  >

                    📅 ${dateText}

                    ${timeText ? ` &nbsp; at &nbsp; ${timeText}` : ""}

                  </div>

                  <!-- TYPE -->

                  <div
                    style="
                      margin-bottom:20px;
                    "
                  >

                    <span
                      style="
                        display:inline-block;
                        padding:6px 10px;
                        background:#eff6ff;
                        color:#2563eb;
                        border-radius:6px;
                        font-size:12px;
                        font-weight:600;
                        text-transform:capitalize;
                      "
                    >
                      ${activity.type}
                    </span>

                  </div>

                  <!-- RELATED TO -->

                  ${
                    relatedName
                      ? `
                        <div
                          style="
                            margin-bottom:20px;
                            font-size:14px;
                            color:#6b7280;
                          "
                        >

                          <div
                            style="
                              font-size:12px;
                              color:#9ca3af;
                              margin-bottom:4px;
                            "
                          >
                            Related to
                          </div>

                          <div
                            style="
                              color:#374151;
                              font-weight:500;
                            "
                          >
                            ${relatedName}
                          </div>

                        </div>
                      `
                      : ""
                  }

                  <!-- NOTES -->

                  ${
                    activity.description
                      ? `
                        <div
                          style="
                            margin-top:20px;
                          "
                        >

                          <div
                            style="
                              font-size:12px;
                              color:#9ca3af;
                              margin-bottom:8px;
                            "
                          >
                            Notes
                          </div>

                          <div
                            style="
                              background:#fafafa;
                              border:1px solid #eeeeee;
                              border-radius:8px;
                              padding:16px;
                              font-size:14px;
                              line-height:1.6;
                              color:#4b5563;
                            "
                          >
                            ${activity.description}
                          </div>

                        </div>
                      `
                      : ""
                  }

                </div>

                <!-- OWNER -->

                <div
                  style="
                    padding:18px 30px;
                    border-top:1px solid #eeeeee;
                    background:#fafafa;
                    font-size:13px;
                    color:#6b7280;
                  "
                >

                  Activity owner:

                  <strong
                    style="
                      color:#374151;
                    "
                  >
                    ${activity.owner.name || "You"}
                  </strong>

                </div>

                <!-- FOOTER -->

                <div
                  style="
                    padding:18px 30px;
                    text-align:center;
                    font-size:11px;
                    color:#9ca3af;
                    background:#ffffff;
                  "
                >

                  This is an automatic activity reminder.
                  <br />

                  Please do not reply to this email.

                </div>

              </div>

            </div>
          `,
        });

        // =========================================
        // MARK AS SENT
        // =========================================

        activity.reminderSent = true;

        await activity.save();

        console.log(
          "✅ Activity reminder sent:",
          activity.title,
          "→",
          activity.owner.email,
        );
      } catch (activityError) {
        console.error(
          "❌ Failed to send reminder for activity:",
          activity._id,
          activityError,
        );
      }
    }
  } catch (error) {
    console.error("❌ Activity reminder error:", error);
  }
};

// =============================================
// RUN EVERY MINUTE
// =============================================

cron.schedule(
  "* * * * *",

  async () => {
    await sendActivityReminders();
  },

  {
    noOverlap: true,
  },
);

export default sendActivityReminders;
