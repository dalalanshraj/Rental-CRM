import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../api/axios";

import ActivityComposer from "./ActivityComposer";

import {
  MdOutlineTaskAlt,
  MdCall,
  MdEmail,
  MdGroups,
  MdOutlineEvent,
  MdCheckCircle,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";

import { BsThreeDotsVertical, BsCalendar3, BsClock } from "react-icons/bs";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ActivityTab({ type, data }) {
  // =========================================================
  // STATE
  // =========================================================

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showComposer, setShowComposer] = useState(true);

  const [menuOpen, setMenuOpen] = useState(null);

  const [editingActivity, setEditingActivity] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // =========================================================
  // FETCH ACTIVITIES
  // =========================================================

  useEffect(() => {
    if (data?._id) {
      fetchActivities();
    }
  }, [data?._id, type]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      let url = "/activities?";

      if (type === "lead") {
        url += `leadId=${data._id}`;
      } else {
        url += `organizationId=${data._id}`;
      }

      const res = await api.get(url);

      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch activities error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CREATE ACTIVITY
  // =========================================================

  const handleCreate = async (activityData) => {
    try {
      const body = {
        ...activityData,

        lead: type === "lead" ? data?._id : null,

        organization:
          type === "organization" ? data?._id : data?.organization?._id || null,
      };

      const res = await api.post("/activities", body);

      // Add instantly at top
      setActivities((prev) => [res.data, ...prev]);

      setShowComposer(false);

      // Small refresh to ensure populated data
      fetchActivities();
    } catch (error) {
      console.error("Create activity error:", error);

      alert(error?.response?.data?.message || "Failed to create activity.");

      throw error;
    }
  };

  // =========================================================
  // DELETE ACTIVITY
  // =========================================================

  const handleDelete = async (activityId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?",
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(activityId);

      await api.delete(`/activities/${activityId}`);

      setActivities((prev) => prev.filter((item) => item._id !== activityId));

      setMenuOpen(null);
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to delete activity.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // COMPLETE / UNCOMPLETE
  // =========================================================

  const handleComplete = async (activityId) => {
    try {
      setActionLoading(activityId);

      const res = await api.patch(`/activities/${activityId}/complete`);

      setActivities((prev) =>
        prev.map((item) => (item._id === activityId ? res.data : item)),
      );

      setMenuOpen(null);
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to update activity.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // EDIT ACTIVITY
  // =========================================================

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setMenuOpen(null);
    setShowComposer(true);
  };

  // =========================================================
  // UPDATE ACTIVITY
  // =========================================================

  const handleUpdate = async (activityData) => {
    if (!editingActivity?._id) {
      return;
    }

    try {
      const body = {
        ...activityData,

        lead: type === "lead" ? data?._id : null,

        organization:
          type === "organization" ? data?._id : data?.organization?._id || null,
      };

      const res = await api.put(`/activities/${editingActivity._id}`, body);

      setActivities((prev) =>
        prev.map((item) =>
          item._id === editingActivity._id ? res.data : item,
        ),
      );

      setEditingActivity(null);

      setShowComposer(false);

      fetchActivities();
    } catch (error) {
      console.error("Update activity error:", error);

      alert(error?.response?.data?.message || "Failed to update activity.");

      throw error;
    }
  };

  // =========================================================
  // CANCEL COMPOSER
  // =========================================================

  const handleCancelComposer = () => {
    setEditingActivity(null);

    setShowComposer(false);
  };

  // =========================================================
  // ICON
  // =========================================================

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case "call":
        return <MdCall size={21} />;

      case "email":
        return <MdEmail size={21} />;

      case "meeting":
        return <MdGroups size={21} />;

      case "deadline":
        return <MdOutlineEvent size={21} />;

      default:
        return <MdOutlineTaskAlt size={21} />;
    }
  };

  // =========================================================
  // ICON BACKGROUND
  // =========================================================

  const getIconStyle = (activityType) => {
    switch (activityType) {
      case "call":
        return "bg-blue-100 text-blue-600";

      case "email":
        return "bg-green-100 text-green-600";

      case "meeting":
        return "bg-purple-100 text-purple-600";

      case "deadline":
        return "bg-red-100 text-red-600";

      default:
        return "bg-orange-100 text-orange-600";
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  // const formatDate = (date) => {
  //   if (!date) {
  //     return "-";
  //   }

  //   return new Date(date).toLocaleDateString(undefined, {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  // // =========================================================
  // // TIME
  // // =========================================================

  // const formatTime = (time) => {
  //   if (!time) {
  //     return null;
  //   }

  //   const [hour, minute] = time.split(":");

  //   const date = new Date();

  //   date.setHours(Number(hour), Number(minute));

  //   return date.toLocaleTimeString(undefined, {
  //     hour: "numeric",
  //     minute: "2-digit",
  //   });
  // };

  // =========================================================
  // SORT
  // =========================================================

  const sortedActivities = [...activities].sort((a, b) => {
    return (
      new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate)
    );
  });

  const handleSave = async (activityData) => {
    try {
      if (editingActivity) {
        await api.put(`/activities/${editingActivity._id}`, activityData);
      } else {
        await api.post("/activities", activityData);
      }

      setEditingActivity(null);

      fetchActivities();
    } catch (error) {
      console.error(error);
    }
  };
 const formatActivityDateTime = (
  date,
  startTime,
  activityType
) => {
  if (!date) return "-";

  const activityDate = new Date(date);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const targetDay = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth(),
    activityDate.getDate()
  );

  const diffDays = Math.round(
    (targetDay - today) /
      (1000 * 60 * 60 * 24)
  );

  let dateText = "";

  if (diffDays === 0) {
    dateText = "Today";
  } else if (diffDays === 1) {
    dateText = "Tomorrow";
  } else if (diffDays === -1) {
    dateText = "Yesterday";
  } else if (diffDays < 0 && diffDays >= -7) {
    const weekday =
      activityDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

    dateText = `Last ${weekday}`;
  } else if (diffDays > 0 && diffDays <= 7) {
    const weekday =
      activityDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

    dateText = weekday;
  } else {
    dateText =
      activityDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
  }

  if (!startTime) {
    return dateText;
  }

  const [hours, minutes] = startTime.split(":");

  const time = new Date();

  time.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  // =========================================
  // EMAIL TIME = 1 HOUR BACK
  // =========================================

  if (activityType === "email") {
    time.setHours(time.getHours() - 1);
  }

  const timeText =
    time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return `${dateText} at ${timeText}`;
};
  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full">
      {/* =====================================================
          ADD ACTIVITY BUTTON
      ====================================================== */}

      {!showComposer && (
        <div className="mb-5">
          <button
            type="button"
            onClick={() => {
              setEditingActivity(null);
              setShowComposer(true);
            }}
            className="
              w-full
              border
              border-dashed
              border-gray-300
              rounded-2xl
              py-5
              text-gray-500
              hover:border-blue-400
              hover:text-[#4B49AC]
              hover:bg-[#4B49AC]
              transition
            "
          >
            {editingActivity ? "Edit Activity" : "Add Activity"}
          </button>
        </div>
      )}

      {/* =====================================================
          COMPOSER
      ====================================================== */}

      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
            className="mb-7 overflow-hidden"
          >
            <ActivityComposer
              type={type}
              data={data}
              editingActivity={editingActivity}
              onSave={editingActivity ? handleUpdate : handleCreate}
              onCancel={handleCancelComposer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ACTIVITIES HEADER
      ====================================================== */}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Activities</h2>

          <p className="text-sm text-gray-500 mt-1">
            Tasks and activities related to this record
          </p>
        </div>

        {!showComposer && (
          <button
            type="button"
            onClick={() => {
              setEditingActivity(null);
              setShowComposer(true);
            }}
            className="
              px-4
              py-2
              rounded-xl
              bg-blue-600
              text-white
              text-sm
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            + Activity
          </button>
        )}
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                  h-32
                  bg-gray-100
                  rounded-2xl
                  animate-pulse
                "
            />
          ))}
        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading && sortedActivities.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
              border
              border-gray-200
              rounded-2xl
              bg-gray-50
              py-12
              px-5
              text-center
            "
        >
          <div
            className="
              w-14
              h-14
              rounded-full
              bg-white
              border
              mx-auto
              flex
              items-center
              justify-center
              text-gray-400
            "
          >
            <MdOutlineTaskAlt size={27} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-700">
            No activities yet
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Create an activity to keep track of your work.
          </p>
        </motion.div>
      )}

      {/* =====================================================
          ACTIVITY LIST
      ====================================================== */}

      {!loading && sortedActivities.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedActivities.map((activity) => (
              <motion.div
                key={activity._id}
                layout
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.22,
                }}
                className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      shadow-sm
                      hover:shadow-md
                      transition
                    "
              >
                {/* =================================
                        ACTIVITY TOP
                    ================================== */}

                <div className="p-5">
                  <div className="flex justify-between gap-4">
                    {/* LEFT */}

                    <div className="flex gap-4 min-w-0">
                      <div
                        className={`
                              flex
                             -shrink-0
                              items-center
                              justify-center
                              w-11
                              h-11
                              rounded-xl
                              ${getIconStyle(activity.type)}
                            `}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`
                                  font-semibold
                                  text-lg
                                  truncate
                                  ${
                                    activity.status === "completed"
                                      ? "text-gray-400 line-through"
                                      : "text-gray-800"
                                  }
                                `}
                          >
                            {activity.title}
                          </h3>

                          {activity.status === "completed" && (
                            <MdCheckCircle
                              className="text-green-500 flex-shrink-0"
                              size={19}
                            />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {formatActivityDateTime(
                              activity.dueDate,
                              activity.startTime,
                            )}
                          </div>
                          {/* {activity.startTime && (
                      <div className="flex items-center gap-2">
                        <BsClock />

                        {formatTime(activity.startTime)}

                        {activity.endTime &&
                          ` - ${formatTime(activity.endTime)}`}
                      </div>
                    )} */}
                        </div>
                      </div>
                    </div>

                    {/* THREE DOTS */}

                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === activity._id ? null : activity._id,
                          )
                        }
                        className="
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              hover:bg-gray-100
                              text-gray-500
                            "
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {menuOpen === activity._id && (
                        <div
                          className="
                              absolute
                              right-0
                              top-10
                              w-44
                              bg-white
                              border
                              border-gray-200
                              rounded-xl
                              shadow-xl
                              z-50
                              overflow-hidden
                            "
                        >
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => handleEditActivity(activity)}
                            className=" w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                            hover:bg-gray-50 "
                          >
                            <FiEdit2 size={16} />
                            Edit
                          </button>
                          {/* COMPLETE */}

                          <button
                            type="button"
                            onClick={() => handleComplete(activity._id)}
                            className="
                                  w-full
                                  flex
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  text-sm
                                  text-left
                                  hover:bg-gray-50
                                "
                          >
                            {activity.status === "completed" ? (
                              <MdOutlineRadioButtonUnchecked size={18} />
                            ) : (
                              <MdCheckCircle
                                size={18}
                                className="text-green-600"
                              />
                            )}

                            {activity.status === "completed"
                              ? "Mark as pending"
                              : "Mark as done"}
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => handleDelete(activity._id)}
                            className="
                                  w-full
                                  flex
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  text-sm
                                  text-left
                                  text-red-600
                                  hover:bg-red-50
                                "
                          >
                            <FiTrash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* =================================
                          DESCRIPTION
                      ================================== */}

                  {activity.description && (
                    <div
                      className="mt-4  border
                border-yellow-300
                bg-yellow-50
                rounded-xl p-3 text-sm text-gray-600 leading-6"
                    >
                      {activity.description}
                    </div>
                  )}

                  {/* =================================
                          DATE / TIME
                      ================================== */}
                  {/* 
                  <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-x-6
                        gap-y-2
                        mt-5
                        text-sm
                        text-gray-500
                      "
                  >
                    <div className="flex items-center gap-2">
                      <BsCalendar3 />

                      {formatDate(activity.dueDate)}
                    </div>

                    {activity.startTime && (
                      <div className="flex items-center gap-2">
                        <BsClock />

                        {formatTime(activity.startTime)}

                        {activity.endTime &&
                          ` - ${formatTime(activity.endTime)}`}
                      </div>
                    )}
                  </div> */}

                  {/* =================================
                          OWNER
                      ================================== */}

                  <div
                    className="
                        mt-5
                        pt-4
                        border-t
                        border-gray-100
                        flex
                        items-center
                        justify-between
                      "
                  >
                    <div className="text-xs text-gray-500">
                      Owner
                      <span className="ml-2 font-medium text-gray-700">
                        {activity.owner?.name
                          ? `${activity.owner.name} (You)`
                          : "You"}
                      </span>
                    </div>

                    {/* QUICK COMPLETE */}

                    <button
                      type="button"
                      disabled={actionLoading === activity._id}
                      onClick={() => handleComplete(activity._id)}
                      className={`
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            transition
                            ${
                              activity.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500 hover:text-green-600"
                            }
                          `}
                    >
                      <MdCheckCircle size={18} />

                      {activity.status === "completed"
                        ? "Completed"
                        : "Mark done"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
