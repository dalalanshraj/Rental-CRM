import { useState, useEffect } from "react";

import {
  MdOutlineTaskAlt,
  MdCall,
  MdEmail,
  MdGroups,
  MdOutlineEvent,
  MdOutlineVideoCall,
} from "react-icons/md";

import { HiOutlineLocationMarker, HiOutlineDocumentText } from "react-icons/hi";

import { BsCalendar3, BsClock } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ActivityComposer({
  type = "lead",
  data,
  onSave,
  onCancel,
  editingActivity = null,
}) {
  const [form, setForm] = useState({
    title: "",
    type: "task",
    dueDate: null,
    startTime: null,
    endTime: null,
    description: "",
    note: "",
  });

  const [showDescription, setShowDescription] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [location, setLocation] = useState("");
  const [videoCall, setVideoCall] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // ACTIVITY TYPES
  // ==========================================

  const activityTypes = [
    {
      value: "task",
      label: "Task",
      icon: <MdOutlineTaskAlt size={21} />,
    },

    {
      value: "call",
      label: "Call",
      icon: <MdCall size={21} />,
    },

    {
      value: "email",
      label: "Email",
      icon: <MdEmail size={21} />,
    },

    {
      value: "meeting",
      label: "Meeting",
      icon: <MdGroups size={21} />,
    },

    {
      value: "deadline",
      label: "Deadline",
      icon: <MdOutlineEvent size={21} />,
    },
  ];

  // ==========================================
  // UPDATE FORM
  // ==========================================

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      type: "task",
      dueDate: "",
      startTime: "",
      endTime: "",
      description: "",
      note: "",
    });

    setLocation("");
    setVideoCall(false);

    setShowDescription(false);
    setShowNote(false);
    setShowLocation(false);
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    resetForm();

    if (onCancel) {
      onCancel();
    }
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Please enter activity title.");
      return;
    }

    if (!form.dueDate) {
      alert("Please select a date.");
      return;
    }

    try {
      setSaving(true);

      const activityData = {
        title: form.title.trim(),
        type: form.type,
        dueDate: form.dueDate,
        startTime: form.startTime,
        description: form.description,
        note: form.note,
        location: location,
        videoCall: videoCall,

        lead: type === "lead" ? data?._id : null,

        organization:
          type === "organization" ? data?._id : data?.organization?._id || null,
      };

      if (onSave) {
        await onSave(activityData);
      }

      resetForm();
    } catch (error) {
      console.error("Create activity error:", error);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOAD ACTIVITY FOR EDIT
  // ==========================================

  useEffect(() => {
    if (!editingActivity) {
      return;
    }

    setForm({
      title: editingActivity.title || "",

      type: editingActivity.type || "task",

      dueDate: editingActivity.dueDate
        ? new Date(editingActivity.dueDate).toISOString().split("T")[0]
        : "",

      startTime: editingActivity.startTime || "",

      endTime: editingActivity.endTime || "",

      description: editingActivity.description || "",

      note: editingActivity.note || "",
    });

    setLocation(editingActivity.location || "");

    setVideoCall(editingActivity.videoCall || false);

    setShowDescription(Boolean(editingActivity.description));

    setShowNote(Boolean(editingActivity.note));

    setShowLocation(Boolean(editingActivity.location));
  }, [editingActivity]);
  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="p-6 sm:p-7">
        {/* =====================================
            TITLE
        ====================================== */}

        <div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="New Task"
            className="
              w-full
              border-0
              border-b
              border-gray-300
              pb-4
              text-3xl
              sm:text-[20px]
              font-semibold
              text-gray-800
              placeholder:text-gray-400
              outline-none
              focus:border-blue-500
              transition
            "
          />
        </div>

        {/* =====================================
            ACTIVITY TYPE
        ====================================== */}

        <div className="mt-5">
          <div className="flex flex-wrap gap-3">
            {activityTypes.map((item) => {
              const active = form.type === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  title={item.label}
                  onClick={() => updateField("type", item.value)}
                  className={`
                    w-8
                    h-8
                    rounded-xl
                    border
                    flex
                     
                    items-center
                    justify-center
                    transition-all
                    duration-200
                    ${
                      active
                        ? "bg-[#4B49AC] text-white    "
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }
                  `}
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================
    DATE + TIME
================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
          {/* =================================================
      DATE
  ================================================= */}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BsCalendar3 size={14} />
              Date
            </label>

            <DatePicker
              selected={form.dueDate ? new Date(form.dueDate) : null}
              onChange={(date) => updateField("dueDate", date)}
              minDate={new Date()}
              todayButton="Today"
              dateFormat="dd MMM yyyy"
              placeholderText="Select date"
              className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-20
        py-3
        text-gray-800
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        cursor-pointer
      "
              calendarClassName="activity-datepicker"
            />
          </div>

          {/* =================================================
      START TIME
  ================================================= */}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BsClock size={14} />
              Start Time
            </label>

            <DatePicker
              selected={
                form.startTime ? new Date(`1970-01-01T${form.startTime}`) : null
              }
              onChange={(date) => {
                if (!date) {
                  updateField("startTime", "");
                  return;
                }

                const hours = String(date.getHours()).padStart(2, "0");

                const minutes = String(date.getMinutes()).padStart(2, "0");

                updateField("startTime", `${hours}:${minutes}`);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText=" Select Time"
              className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-20
        py-3
        text-gray-800
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        cursor-pointer
      "
            />
          </div>

          {/* =================================================
      END TIME
  ================================================= */}

          {/* <div>

    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <BsClock size={14} />
      End Time
    </label>

    <DatePicker
      selected={
        form.endTime
          ? new Date(
              `1970-01-01T${form.endTime}`
            )
          : null
      }
      onChange={(date) => {
        if (!date) {
          updateField("endTime", "");
          return;
        }

        const hours = String(
          date.getHours()
        ).padStart(2, "0");

        const minutes = String(
          date.getMinutes()
        ).padStart(2, "0");

        updateField(
          "endTime",
          `${hours}:${minutes}`
        );
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      placeholderText="End time"
      className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        text-gray-800
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        cursor-pointer
      "
    />

  </div> */}
        </div>
        {/* =====================================
            EXTRA OPTIONS
        ====================================== */}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
          {/* LOCATION */}

          {/* VIDEO CALL */}

          {/* DESCRIPTION */}

          <button
            type="button"
            onClick={() => setShowDescription((prev) => !prev)}
            className={`
              flex
               p-2
                    rounded-xl
                    border
              items-center
              gap-2
              text-sm
              font-medium
              transition
              ${
                showDescription
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }
            `}
          >
            <HiOutlineDocumentText size={18} />
            Notes
          </button>

          {/* NOTE */}
        </div>

        {/* =====================================
            LOCATION INPUT
        ====================================== */}

        {showLocation && (
          <div className="mt-5">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        )}

        {/* =====================================
            DESCRIPTION
        ====================================== */}

        {showDescription && (
          <div className="mt-5">
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Write activity details..."
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                p-4
                resize-none
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        )}

        {/* =====================================
            NOTE
        ====================================== */}

        {showNote && (
          <div className="mt-5">
            <textarea
              rows={4}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Add a note..."
              className="
                w-full
                border
                border-yellow-300
                bg-yellow-50
                rounded-xl
                p-4
                resize-none
                outline-none
                focus:border-yellow-500
                focus:ring-2
                focus:ring-yellow-100
              "
            />
          </div>
        )}

        {/* =====================================
            OWNER
        ====================================== */}

        <div className="mt-6">
          <div className="border border-gray-300 rounded-xl px-4 py-4">
            <p className="text-xs text-gray-500">Owner</p>

            <p className="text-sm font-semibold text-gray-800 mt-1">
              {data?.owner?.name ? `${data.owner.name} (You)` : "You"}
            </p>
          </div>
        </div>
         <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="
              px-6
              py-2.5
              rounded-xl
              border
              border-gray-300
              text-gray-700
              font-medium
              hover:bg-gray-50
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              px-7
              py-2.5
              rounded-xl
              bg-[#4B49AC]
              text-white
              font-medium
              hover:bg-[#4B49AC]
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {saving
              ? "Saving..."
              : editingActivity
                ? "Update Activity"
                : "Save Activity"}
          </button>
        </div>
      </div>

      {/* =====================================
          FOOTER
      ====================================== */}
    </div>
  );
}
