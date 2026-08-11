import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaPencil } from "react-icons/fa6";
import { Check, X, Loader2 } from "lucide-react";

export default function EditableField({
  label,
  field,
  value,
  itemId,
  endpoint = "leads",
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [input, setInput] = useState(
    typeof value === "object"
      ? JSON.stringify(value)
      : value || ""
  );

  /* =====================================
      KEEP INPUT IN SYNC
  ====================================== */

  useEffect(() => {
    setInput(
      typeof value === "object"
        ? JSON.stringify(value)
        : value || ""
    );
  }, [value]);

  /* =====================================
      START EDITING
  ====================================== */

  const startEditing = () => {
    setInput(
      typeof value === "object"
        ? JSON.stringify(value)
        : value || ""
    );

    setEditing(true);
  };

  /* =====================================
      CANCEL
  ====================================== */

  const cancelEditing = () => {
    setInput(
      typeof value === "object"
        ? JSON.stringify(value)
        : value || ""
    );

    setEditing(false);
  };

  /* =====================================
      SAVE
  ====================================== */

  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        [field]: input,
      };

      const res = await api.put(
        `/${endpoint}/${itemId}`,
        payload
      );

      onUpdate(res.data);

      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* =====================================
      KEYBOARD
  ====================================== */

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

  /* =====================================
      DISPLAY VALUE
  ====================================== */

  const displayValue = () => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    if (typeof value === "object") {
      if (
        value.street ||
        value.city ||
        value.state ||
        value.country ||
        value.zipCode
      ) {
        return [
          value.street,
          value.city,
          value.state,
          value.country,
          value.zipCode,
        ]
          .filter(Boolean)
          .join(", ");
      }

      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <div className="group w-full py-0 flex gap-10">

      {/* =====================================
          LABEL
      ====================================== */}

      {label && (
        <div className="mb-1.5">
          <span
            className="
              text-xs
              font-medium
              text-gray-500
              capitalize
            "
          >
            {label}
          </span>
        </div>
      )}

      {/* =====================================
          VIEW MODE
      ====================================== */}

      {!editing ? (
        <div
          className="
            flex
            items-center
            gap-2
            w-full
            min-h-[34px]
          "
        >

          {/* VALUE */}

          <span
            className="
              flex-1
              min-w-0
              truncate
              text-sm
              text-gray-800
            "
            title={String(displayValue())}
          >
            {displayValue()}
          </span>

          {/* EDIT BUTTON */}

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
      ) : (

        /* =====================================
            EDIT MODE
        ====================================== */

        <div className="w-full">

          {/* INPUT */}

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            className="
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
            autoFocus
            onKeyDown={handleKeyDown}
          />

          {/* ACTIONS */}

          <div className="flex justify-end items-center gap-2 mt-2">

            {/* CANCEL */}

            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              title="Cancel"
              className="
                h-9
                px-3
                rounded-lg
                bg-red-50
                text-red-500
                text-xs
                font-medium
                flex
                items-center
                justify-center
                gap-1.5
                hover:bg-red-500
                hover:text-white
                transition-all
                duration-200
                disabled:opacity-50
              "
            >
              <X size={14} />
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={save}
              disabled={saving}
              title="Save"
              className="
                h-9
                px-3
                rounded-lg
                bg-emerald-50
                text-emerald-600
                text-xs
                font-medium
                flex
                items-center
                justify-center
                gap-1.5
                hover:bg-emerald-500
                hover:text-white
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {saving ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Check size={14} />
              )}

              {saving ? "Saving..." : "Save"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}