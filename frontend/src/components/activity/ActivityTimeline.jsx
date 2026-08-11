import { useState } from "react";
import api from "../../api/axios";

export default function ActivityForm({
  type,
  data,
  onCreated,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "task",
    priority: "medium",
    description: "",
    dueDate: "",
    startTime: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setForm({
      title: "",
      type: "task",
      priority: "medium",
      description: "",
      dueDate: "",
      startTime: "",
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      return alert("Please enter activity title.");
    }

    try {
      setLoading(true);

      const body = {
        ...form,

        lead:
          type === "lead"
            ? data._id
            : null,

        organization:
          type === "organization"
            ? data._id
            : data.organization?._id || null,
      };

      const res = await api.post(
        "/activities",
        body
      );

      onCreated(res.data);

      handleCancel();

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 rounded-xl p-5 mb-6">

      <h3 className="text-lg font-semibold mb-5">
        Create Activity
      </h3>

      {/* Title */}

      <div className="mb-4">

        <label className="block text-sm font-medium mb-2">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Follow up with customer..."
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Type + Priority */}

      <div className="grid grid-cols-2 gap-4 mb-4">

        <div>

          <label className="block text-sm font-medium mb-2">
            Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="task">Task</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="deadline">Deadline</option>
          </select>

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Priority
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>

        </div>

      </div>

      {/* Date + Time */}

      <div className="grid grid-cols-2 gap-4 mb-4">

        <div>

          <label className="block text-sm font-medium mb-2">
            Date
          </label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Time
          </label>

          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

      </div>

      {/* Description */}

      <div className="mb-5">

        <label className="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write activity details..."
          className="w-full border rounded-lg px-4 py-3 resize-none"
        />

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3">

        <button
          onClick={handleCancel}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>

      </div>

    </div>
  );
}