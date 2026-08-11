import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaPencil } from "react-icons/fa6";
import {
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function EditableLinkField({
  label,
  field,
  value,
  itemId,
  leadId,
  endpoint = "leads",
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState(value || "");

  /* =====================================
      KEEP INPUT UPDATED
  ====================================== */

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  /* =====================================
      START EDITING
  ====================================== */

  const startEditing = () => {
    setInput(value || "");
    setEditing(true);
  };

  /* =====================================
      CANCEL
  ====================================== */

  const cancelEditing = () => {
    setInput(value || "");
    setEditing(false);
  };

  /* =====================================
      SAVE
  ====================================== */

  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const id = itemId || leadId;

      const res = await api.put(
        `/${endpoint}/${id}`,
        {
          [field]: input.trim(),
        }
      );

      onUpdate(res.data);

      setEditing(false);
    } catch (err) {
      console.error(
        "Link field update failed:",
        err
      );
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
      URL
  ====================================== */

  const getUrl = () => {
    if (!value) return "#";

    return value.startsWith("http://") ||
      value.startsWith("https://")
      ? value
      : `https://${value}`;
  };

  /* =====================================
      DISPLAY URL
  ====================================== */

  const displayUrl = () => {
    if (!value) return "-";

    return value
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
  };

  return (
    <div className="group w-full py-0 flex gap-10">

      {/* =====================================
          LABEL
      ====================================== */}

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

          {/* LINK */}

          {value ? (
            <a
              href={getUrl()}
              target="_blank"
              rel="noopener noreferrer"
              title={value}
              className="
                flex
                items-center
                gap-1.5
                flex-1
                min-w-0
                truncate
                text-sm
                text-[#4B49AC]
                hover:text-indigo-700
                hover:underline
                transition
              "
            >
              <span className="truncate">
                {displayUrl()}
              </span>

              <ExternalLink
                size={13}
                className="
                  flex-shrink-0
                  opacity-60
                "
              />
            </a>
          ) : (
            <span
              className="
                flex-1
                min-w-0
                text-sm
                text-gray-400
              "
            >
              -
            </span>
          )}

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

          <div className="relative">

            <input
              type="url"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="https://example.com"
              className="
                w-full
                h-10
                px-3
                pr-10
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

            <ExternalLink
              size={15}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              justify-end
              items-center
              gap-2
              mt-2
            "
          >

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

              {saving
                ? "Saving..."
                : "Save"}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}