 import { useEffect, useState } from "react";
import api from "../api/axios";

import { FaPencil } from "react-icons/fa6";

import {
  Check,
  X,
  Loader2,
} from "lucide-react";

export default function EditableField({
  label,
  field,
  value,
  itemId,
  leadId,
  endpoint = "leads",
  onUpdate,
  variant = "default",
}) {
  // =====================================================
  // ID
  // =====================================================

  const actualId = itemId || leadId;

  // =====================================================
  // STATE
  // =====================================================

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FORMAT VALUE FOR INPUT
  // =====================================================

  const formatValue = (val) => {
    if (
      val === null ||
      val === undefined
    ) {
      return "";
    }

    if (typeof val === "object") {
      return JSON.stringify(val);
    }

    return String(val);
  };

  // =====================================================
  // INPUT
  // =====================================================

  const [input, setInput] = useState(
    formatValue(value)
  );

  // =====================================================
  // SYNC VALUE
  // =====================================================

  useEffect(() => {
    if (!editing) {
      setInput(
        formatValue(value)
      );
    }
  }, [value, editing]);

  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = () => {
    setInput(
      formatValue(value)
    );

    setEditing(true);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const cancelEditing = () => {
    setInput(
      formatValue(value)
    );

    setEditing(false);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const save = async () => {
    if (
      saving ||
      !actualId
    ) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        [field]: input,
      };

      const res = await api.put(
        `/${endpoint}/${actualId}`,
        payload
      );

      // Update parent
      if (onUpdate) {
        onUpdate(res.data);
      }

      setEditing(false);

    } catch (err) {
      console.error(
        "Update failed:",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // KEYBOARD
  // =====================================================

  const handleKeyDown = (e) => {

    // Enter = Save
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }

    // Escape = Cancel
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  // =====================================================
  // DISPLAY VALUE
  // =====================================================

  const displayValue = () => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    // Object
    if (
      typeof value === "object"
    ) {

      // ADDRESS OBJECT
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

      return JSON.stringify(
        value
      );
    }

    return value;
  };

  // =====================================================
  // =====================================================
  // HEADER VARIANT
  // =====================================================
  // =====================================================

  if (variant === "header") {
    return (
      <div
        className="
          group
          w-full
          min-w-0
        "
      >

        {/* =================================================
            HEADER VIEW MODE
        ================================================= */}

        {!editing ? (

          <div
            className="
              flex
              items-center
              gap-2
              min-w-0
            "
          >

            {/* NAME */}

            <span
              className="
                truncate
                text-lg
                font-bold
                text-gray-800
                min-w-0
              "
              title={String(
                displayValue()
              )}
            >
              {displayValue()}
            </span>

            {/* EDIT */}

            <button
              type="button"
              onClick={startEditing}
              title={`Edit ${label || "name"}`}
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
              <FaPencil
                size={11}
              />
            </button>

          </div>

        ) : (

          /* =================================================
              HEADER EDIT MODE
          ================================================= */

          <div
            className="
              w-full
              max-w-[520px]
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              {/* INPUT */}

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                autoFocus
                disabled={saving}
                className="
                  flex-1
                  min-w-0
                  h-11
                  px-4
                  rounded-xl
                  border-2
                  border-indigo-500
                  bg-white
                  text-lg
                  font-bold
                  text-gray-800
                  outline-none
                  shadow-sm
                  transition-all
                  duration-200
                  focus:ring-4
                  focus:ring-indigo-500/10
                  disabled:opacity-60
                "
              />

              {/* =================================================
                  CANCEL
              ================================================= */}

              <button
                type="button"
                onClick={
                  cancelEditing
                }
                disabled={saving}
                title="Cancel"
                className="
                  h-11
                  px-3
                  rounded-xl
                  bg-red-50
                  text-red-500
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-xs
                  font-semibold
                  border
                  border-red-100
                  hover:bg-red-500
                  hover:text-white
                  hover:border-red-500
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  flex-shrink-0
                "
              >
                <X
                  size={17}
                />

                <span className="hidden sm:inline">
                  Cancel
                </span>
              </button>

              {/* =================================================
                  SAVE
              ================================================= */}

              <button
                type="button"
                onClick={save}
                disabled={
                  saving ||
                  !actualId
                }
                title="Save"
                className="
                  h-11
                  px-3
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-xs
                  font-semibold
                  border
                  border-emerald-100
                  hover:bg-emerald-500
                  hover:text-white
                  hover:border-emerald-500
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  flex-shrink-0
                "
              >

                {saving ? (
                  <Loader2
                    size={17}
                    className="
                      animate-spin
                    "
                  />
                ) : (
                  <Check
                    size={17}
                  />
                )}

                <span className="hidden sm:inline">
                  {saving
                    ? "Saving..."
                    : "Save"}
                </span>

              </button>

            </div>

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // =====================================================
  // DEFAULT VARIANT
  // =====================================================
  // =====================================================

  return (
    <div
      className="
        group
        w-full
        min-w-0
      "
    >

      {/* =================================================
          VIEW MODE
      ================================================= */}

      {!editing ? (

        <div
          className="
            flex
            items-center
            gap-3
            w-full
            min-h-[34px]
          "
        >

          {/* LABEL */}

          {label && (
            <div
              className="
                w-[110px]
                flex-shrink-0
              "
            >
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

          {/* VALUE */}

          <span
            className="
              flex-1
              min-w-0
              truncate
              text-sm
              text-gray-800
            "
            title={String(
              displayValue()
            )}
          >
            {displayValue()}
          </span>

          {/* EDIT BUTTON */}

          <button
            type="button"
            onClick={startEditing}
            title={`Edit ${
              label || ""
            }`}
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
            <FaPencil
              size={12}
            />
          </button>

        </div>

      ) : (

        /* =================================================
            DEFAULT EDIT MODE
        ================================================= */

        <div
          className="
            flex
            items-start
            gap-3
            w-full
          "
        >

          {/* LABEL */}

          {label && (
            <div
              className="
                w-[110px]
                flex-shrink-0
                pt-2.5
              "
            >
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

          {/* INPUT + ACTIONS */}

          <div
            className="
              flex-1
              min-w-0
            "
          >

            {/* INPUT */}

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              autoFocus
              disabled={saving}
              className="
                block
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
                disabled:opacity-60
              "
            />

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
                onClick={
                  cancelEditing
                }
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
                  disabled:cursor-not-allowed
                "
              >
                <X
                  size={14}
                />

                Cancel
              </button>

              {/* SAVE */}

              <button
                type="button"
                onClick={save}
                disabled={
                  saving ||
                  !actualId
                }
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
                    className="
                      animate-spin
                    "
                  />
                ) : (
                  <Check
                    size={14}
                  />
                )}

                {saving
                  ? "Saving..."
                  : "Save"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}