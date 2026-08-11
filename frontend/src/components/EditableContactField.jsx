import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaPencil } from "react-icons/fa6";
import { Loader2, Check, X } from "lucide-react";

export default function EditableContactField({
  label,
  field,
  value,
  type = "work",
  itemId,
  endpoint = "leads",
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [input, setInput] = useState(value || "");
  const [inputType, setInputType] = useState(
    type?.toLowerCase() || "work"
  );

  // Keep input synced with updated parent value
  useEffect(() => {
    setInput(value || "");
  }, [value]);

  useEffect(() => {
    setInputType(type?.toLowerCase() || "work");
  }, [type]);

  const startEditing = () => {
    setInput(value || "");
    setInputType(type?.toLowerCase() || "work");
    setEditing(true);
  };

  const cancelEditing = () => {
    setInput(value || "");
    setInputType(type?.toLowerCase() || "work");
    setEditing(false);
  };

  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);

      let payload = {};

      if (endpoint === "leads") {
        if (field === "email") {
          payload[field] = [
            {
              address: input,
              label: inputType,
            },
          ];
        } else if (field === "phone") {
          payload[field] = [
            {
              number: input,
              label: inputType,
            },
          ];
        } else {
          payload[field] = input;
        }
      } else {
        payload[field] = input;
      }

      const res = await api.put(
        `/${endpoint}/${itemId}`,
        payload
      );

      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.log("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

 return (
  <div className="group w-full py-0">

    {/* =====================================
        VIEW MODE
    ====================================== */}

    {!editing ? (
      <div className="flex items-center gap-3 w-full">

        {/* LABEL */}
        <span
          className="
            w-[90px]
            min-w-[90px]
            flex-shrink-0
            text-sm
            text-gray-500
            capitalize
          "
        >
          {label}
        </span>

        {/* VALUE */}
        <div className="flex items-center gap-2 flex-1 min-w-0">

          <span
            className="
              flex-1
              min-w-0
              truncate
              text-sm
              text-blue-600
            "
            title={value || ""}
          >
            {value || "-"}
          </span>

          {/* TYPE */}
          {value && (
            <span
              className="
                flex-shrink-0
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                bg-gray-100
                text-gray-500
                px-2
                py-1
                rounded-md
              "
            >
              {type}
            </span>
          )}

          {/* EDIT */}
          <button
            type="button"
            onClick={startEditing}
            title={`Edit ${label}`}
            className="
              w-7
              h-7
              flex
              items-center
              justify-center
              rounded-lg
              opacity-0
              group-hover:opacity-100
              text-gray-400
              hover:text-[#4B49AC]
              hover:bg-indigo-50
              transition-all
              duration-200
              flex-shrink-0
            "
          >
            <FaPencil size={12} />
          </button>

        </div>
      </div>
    ) : (

      /* =====================================
          EDIT MODE
      ====================================== */

      <div className="w-full">

        {/* LABEL */}
        <div className="mb-2">

          <span
            className="
              text-sm
              font-medium
              text-gray-600
              capitalize
            "
          >
            {label}
          </span>

        </div>


        {/* INPUT + ACTIONS */}

        <div className="flex items-center gap-2 w-full">

          {/* INPUT */}

          <input
            type={field === "email" ? "email" : "text"}
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            autoFocus
            className="
              flex-1
              min-w-0
              w-full
              h-10
              px-3
              rounded-xl
              border
              border-gray-300
              bg-white
              text-sm
              text-gray-700
              outline-none
              transition-all
              duration-200
              placeholder:text-gray-400
              hover:border-indigo-300
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-500/10
            "
          />


          {/* TYPE */}

          <select
            value={inputType}
            onChange={(e) =>
              setInputType(e.target.value)
            }
            className="
              h-10
              w-[82px]
              px-2
              rounded-xl
              border
              border-gray-300
              bg-white
              text-sm
              text-gray-700
              outline-none
              cursor-pointer
              flex-shrink-0
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-500/10
            "
          >
            <option value="work">
              Work
            </option>

            <option value="home">
              Home
            </option>
          </select>


          {/* SAVE */}

          <button
            type="button"
            onClick={save}
            disabled={saving}
            title="Save"
            className="
              h-10
              w-10
              rounded-xl
              bg-emerald-50
              text-emerald-600
              hover:bg-emerald-500
              hover:text-white
              transition-all
              duration-200
              flex
              items-center
              justify-center
              flex-shrink-0
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Check size={17} />
            )}
          </button>


          {/* CANCEL */}

          <button
            type="button"
            onClick={cancelEditing}
            disabled={saving}
            title="Cancel"
            className="
              h-10
              w-10
              rounded-xl
              bg-red-50
              text-red-500
              hover:bg-red-500
              hover:text-white
              transition-all
              duration-200
              flex
              items-center
              justify-center
              flex-shrink-0
              disabled:opacity-50
            "
          >
            <X size={17} />
          </button>

        </div>

      </div>
    )}
  </div>
);
}