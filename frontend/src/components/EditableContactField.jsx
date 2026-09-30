import { useEffect, useState } from "react";
import api from "../api/axios";

import { FaPencil } from "react-icons/fa6";

import {
  Loader2,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";

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

  // =====================================================
  // NORMALIZE VALUE
  // =====================================================

  const normalizeValues = (val) => {
    if (Array.isArray(val)) {
      return val.length > 0
        ? val
        : [
            field === "phone"
              ? {
                  number: "",
                  label: "work",
                }
              : {
                  address: "",
                  label: "work",
                },
          ];
    }

    if (val) {
      if (field === "phone") {
        return [
          {
            number: val,
            label: type?.toLowerCase() || "work",
          },
        ];
      }

      if (field === "email") {
        return [
          {
            address: val,
            label: type?.toLowerCase() || "work",
          },
        ];
      }
    }

    return [
      field === "phone"
        ? {
            number: "",
            label: "work",
          }
        : {
            address: "",
            label: "work",
          },
    ];
  };

  // =====================================================
  // EDIT VALUES
  // =====================================================

  const [editValues, setEditValues] = useState(
    normalizeValues(value)
  );

  // =====================================================
  // SYNC WITH PARENT
  // =====================================================

  useEffect(() => {
    setEditValues(normalizeValues(value));
  }, [value, field, type]);

  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = () => {
    setEditValues(normalizeValues(value));
    setEditing(true);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const cancelEditing = () => {
    setEditValues(normalizeValues(value));
    setEditing(false);
  };

  // =====================================================
  // ADD PHONE / EMAIL
  // =====================================================

  const addContact = () => {
    setEditValues((prev) => [
      ...prev,
      field === "phone"
        ? {
            number: "",
            label: "work",
          }
        : {
            address: "",
            label: "work",
          },
    ]);
  };

  // =====================================================
  // REMOVE PHONE / EMAIL
  // =====================================================

  const removeContact = (index) => {
    setEditValues((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      // Keep one empty row instead of completely
      // removing the editor
      if (updated.length === 0) {
        return [
          field === "phone"
            ? {
                number: "",
                label: "work",
              }
            : {
                address: "",
                label: "work",
              },
        ];
      }

      return updated;
    });
  };

  // =====================================================
  // VALUE CHANGE
  // =====================================================

  const handleValueChange = (
    index,
    newValue
  ) => {
    setEditValues((prev) =>
      prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        if (field === "phone") {
          return {
            ...item,
            number: newValue,
          };
        }

        return {
          ...item,
          address: newValue,
        };
      })
    );
  };

  // =====================================================
  // TYPE CHANGE
  // =====================================================

  const handleTypeChange = (
    index,
    newType
  ) => {
    setEditValues((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              label: newType,
            }
          : item
      )
    );
  };

  // =====================================================
  // SAVE
  // =====================================================

  const save = async () => {
    if (saving) return;

    try {
      setSaving(true);

      // Remove empty rows
      const cleanedValues = editValues
        .map((item) => {
          if (field === "phone") {
            return {
              number: String(
                item.number || ""
              ).trim(),
              label:
                item.label || "work",
            };
          }

          return {
            address: String(
              item.address || ""
            ).trim(),
            label:
              item.label || "work",
          };
        })
        .filter((item) => {
          if (field === "phone") {
            return item.number;
          }

          return item.address;
        });

      let payload = {};

      // =================================================
      // LEADS
      // =================================================

      if (endpoint === "leads") {
        if (
          field === "phone" ||
          field === "email"
        ) {
          payload[field] =
            cleanedValues;
        } else {
          payload[field] =
            cleanedValues[0] || "";
        }
      }

      // =================================================
      // OTHER ENDPOINTS
      // =================================================

      else {
        if (
          field === "phone" ||
          field === "email"
        ) {
          payload[field] =
            cleanedValues;
        } else {
          payload[field] =
            cleanedValues[0] || "";
        }
      }

      console.log(
        "UPDATE CONTACT PAYLOAD:",
        payload
      );

      const res = await api.put(
        `/${endpoint}/${itemId}`,
        payload
      );

      if (onUpdate) {
        onUpdate(res.data);
      }

      setEditing(false);
    } catch (err) {
      console.error(
        "UPDATE CONTACT ERROR:",
        err.response?.data ||
          err.message
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // KEYBOARD
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }

    // Enter ko save nahi karenge because
    // multiple rows me Enter accidentally save
    // kar sakta hai.
  };

  // =====================================================
  // CONTACT VALUES
  // =====================================================

  const displayValues = Array.isArray(value)
    ? value
    : value
      ? [
          field === "phone"
            ? {
                number: value,
                label: type,
              }
            : {
                address: value,
                label: type,
              },
        ]
      : [];

  // =====================================================
  // VIEW MODE
  // =====================================================

  if (!editing) {
    return (
      <div className="group w-full py-0">
        <div className="flex items-start gap-3 w-full">
          {/* LABEL */}

          <span
            className="
              w-[40px]
              min-w-[40px]
              flex-shrink-0
              text-[#0d68c5]
              
              capitalize
              pt-1
            "
          >
            {label}
          </span>

          {/* VALUES */}

          <div className="flex-1 min-w-0 ">
            {displayValues.length > 0 ? (
              <div className="space-y-1.5 ">
                {displayValues.map(
                  (item, index) => {
                    const displayValue =
                      field === "phone"
                        ? item.number
                        : item.address;

                    if (!displayValue) {
                      return null;
                    }

                    return (
                      <div
                        key={index}
                        className="
                          flex
                          items-center 
                          hover:bg-gray-200
                            p-1 
                            rounded
                            cursor-pointer
                          gap-2
                          mt-1
                          min-w-0
                        "
                      >
                        <span
                          className="
                            flex-1
                            min-w-0
                            truncate
                            text-sm
                            text-blue-600
                            
                            hover:underline
                          "
                          title={displayValue}
                        >
                          {displayValue}
                        </span>

                        {item.label && (
                          <span
                            className="
                              flex-shrink-0
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-wide
                              bg-gray-100
                              text-black
                              px-2
                              py-1
                              rounded-md
                            "
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-400">
                -
              </span>
            )}
          </div>

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
    );
  }

  // =====================================================
  // EDIT MODE
  // =====================================================

  return (
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

      {/* CONTACT ROWS */}

      <div className="space-y-2">
        {editValues.map(
          (item, index) => {
            const currentValue =
              field === "phone"
                ? item.number || ""
                : item.address || "";

            return (
              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-2
                  w-full
                "
              >
                {/* DRAG STYLE ICON */}

                <div
                  className="
                    w-5
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    flex-shrink-0
                  "
                >
                  <span className="text-lg leading-none">
                    ⋮⋮
                  </span>
                </div>

                {/* INPUT */}

                <input
                  type={
                    field === "email"
                      ? "email"
                      : "text"
                  }
                  value={currentValue}
                  onChange={(e) =>
                    handleValueChange(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  autoFocus={
                    index ===
                    editValues.length - 1
                  }
                  placeholder={
                    field === "phone"
                      ? "Phone number"
                      : "Email address"
                  }
                  className="
                    flex-1
                    min-w-0
                    h-12
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
                  value={
                    item.label ||
                    "work"
                  }
                  onChange={(e) =>
                    handleTypeChange(
                      index,
                      e.target.value
                    )
                  }
                  className="
                    h-12
                    w-[150px]
                    px-3
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

                  <option value="mobile">
                    Mobile
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() =>
                    removeContact(index)
                  }
                  disabled={
                    saving
                  }
                  title={
                    field === "phone"
                      ? "Remove phone"
                      : "Remove email"
                  }
                  className="
                    w-11
                    h-11
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:text-red-600
                    hover:bg-red-50
                    transition
                    flex-shrink-0
                    disabled:opacity-50
                  "
                >
                  <Trash2 size={19} />
                </button>
              </div>
            );
          }
        )}
      </div>

      {/* ADD BUTTON */}

      <button
        type="button"
        onClick={addContact}
        disabled={saving}
        className="
          mt-3
          inline-flex
          items-center
          gap-1.5
          text-blue-600
          font-semibold
          text-sm
          hover:text-blue-700
          transition
          disabled:opacity-50
        "
      >
        <Plus size={18} />

        {field === "phone"
          ? "Add phone"
          : "Add email"}
      </button>

      {/* ACTIONS */}

      <div
        className="
          flex
          items-center
          justify-end
          gap-2
          mt-4
        "
      >
        {/* CANCEL */}

        <button
          type="button"
          onClick={cancelEditing}
          disabled={saving}
          className="
            h-10
            px-4
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-700
            text-sm
            font-semibold
            hover:bg-gray-50
            transition
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        {/* SAVE */}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="
            h-10
            px-5
            rounded-xl
            bg-emerald-500
            text-white
            text-sm
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-emerald-600
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {saving ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Check size={17} />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}