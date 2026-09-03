 import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  X,
  Building2,
  UserRound,
  Phone,
  MapPin,
  CalendarDays,
  KeyRound,
  Server,
  Hash,
  Rss,
  Save,
  Loader2,
} from "lucide-react";

export default function AddOrganizationModal({
  onClose,
  onCreated,
}) {
  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    address: "",
    currentBookingPalAccount: "none",
    nextListingExpirationDate: "",
    ecbyoPass: "",
    pmsUsed: "",
    totalUnitsManaged: "",
    unitsOnEcbyo: "",
    listingId: "",
    feedDataLink: "",
  });

  // =====================================================
  // USERS
  // =====================================================

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // =====================================================
  // SUBMIT
  // =====================================================

  const [saving, setSaving] = useState(false);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
  try {
    setLoadingUsers(true);

    const res = await api.get("/auth");

    
    const userData = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.users)
      ? res.data.users
      : [];

    setUsers(userData);

  } catch (err) {
    console.error(
      "FETCH USERS ERROR:",
      err.response?.data || err
    );

    setUsers([]);
  } finally {
    setLoadingUsers(false);
  }
};

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // BOOKING PAL
  // =====================================================

  const handleBookingPalChange = (value) => {
    setForm((prev) => ({
      ...prev,
      currentBookingPalAccount: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    // -----------------------------------------
    // NAME
    // -----------------------------------------

    if (!form.name.trim()) {
      setError("Organization name is required.");
      return;
    }

    // -----------------------------------------
    // OWNER
    // -----------------------------------------

    if (!form.owner) {
      setError("Please select an owner.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),

        owner: form.owner,

        phone: form.phone.trim(),

        address: form.address.trim(),

        currentBookingPalAccount:
          form.currentBookingPalAccount,

        nextListingExpirationDate:
          form.nextListingExpirationDate || null,

        ecbyoPass: form.ecbyoPass,

        pmsUsed: form.pmsUsed.trim(),

        totalUnitsManaged:
          form.totalUnitsManaged === ""
            ? 0
            : Number(form.totalUnitsManaged),

        unitsOnEcbyo:
          form.unitsOnEcbyo === ""
            ? 0
            : Number(form.unitsOnEcbyo),

        listingId: form.listingId.trim(),

        feedDataLink: form.feedDataLink.trim(),
      };

      console.log(
        "CREATE ORGANIZATION PAYLOAD:",
        payload
      );

      const res = await api.post(
        "/organizations",
        payload
      );

      console.log(
        "ORGANIZATION CREATED:",
        res.data
      );

      // Parent ko updated organization denge
      if (onCreated) {
        onCreated(res.data);
      }

      onClose();

    } catch (err) {
      console.error(
        "CREATE ORGANIZATION ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create organization."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // COMMON CLASSES
  // =====================================================

  const inputClass = `
    w-full
    h-11
    px-3.5
    rounded-xl
    border
    border-gray-200
    bg-white
    text-sm
    text-gray-700
    placeholder:text-gray-400
    outline-none
    transition-all
    duration-200
     
  `;

  const labelClass = `
    block
    text-xs
    font-semibold
    text-gray-600
    mb-2
  `;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-4
        bg-slate-950/50
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          if (!saving) {
            onClose();
          }
        }
      }}
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          w-full
          max-w-[550px]
          max-h-[92vh]
          bg-white
          rounded-3xl
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          border
          border-gray-200
          overflow-hidden
          flex
          flex-col
        "
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            px-6
            py-5
            border-b
            border-gray-100
            flex
            items-center
            justify-between
            flex-shrink-0
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#4B49AC]
                text-white
                flex
                items-center
                justify-center
               
                
              "
            >
              {/* shadow-indigo-500/20  ,  shadow-md*/}
              <Building2 size={31} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Add Organization
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Create a new organization
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-700
              transition
              disabled:opacity-50
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            FORM BODY
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            flex-1
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >
          <div className="p-6 space-y-7">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    
                    text-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2 size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Basic Information
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Basic company information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* NAME */}

                <div>
                  <label className={labelClass}>
                    Organization Name
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                {/* OWNER */}

                <div>
                  <label className={labelClass}>
                    Owner
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <UserRound
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        pointer-events-none
                      "
                    />

                    <select
                      name="owner"
                      value={form.owner}
                      onChange={handleChange}
                      disabled={loadingUsers}
                      className={`
                        ${inputClass}
                        pl-10
                        appearance-none
                        cursor-pointer
                        disabled:bg-gray-50
                        disabled:cursor-wait
                      `}
                    >
                      <option value="">
                        {loadingUsers
                          ? "Loading users..."
                          : "Select owner"}
                      </option>

                      {users.map((user) => (
                        <option
                          key={user._id}
                          value={user._id}
                        >
                          {user.name ||
                            user.email ||
                            "Unnamed User"}
                        </option>
                      ))}
                    </select>

                    <span
                      className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        pointer-events-none
                        text-xs
                      "
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label className={labelClass}>
                    Company Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Company phone"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* FULL ADDRESS */}

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Full Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-3.5
                        text-gray-400
                      "
                    />

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter full company address"
                      rows={3}
                      className="
                        w-full
                        px-3.5
                        py-3
                        pl-10
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-sm
                        text-gray-700
                        placeholder:text-gray-400
                        outline-none
                        resize-none
                        transition-all
                        duration-200
                        
                      "
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                BOOKING PAL
            ================================================= */}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    
                    text-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Server size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Booking Pal
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Booking Pal account information
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Current Booking Pal Account
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "none",
                      label: "None",
                    },
                    {
                      value: "yes",
                      label: "Yes",
                    },
                    {
                      value: "no",
                      label: "No",
                    },
                  ].map((option) => {
                    const active =
                      form.currentBookingPalAccount ===
                      option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleBookingPalChange(
                            option.value
                          )
                        }
                        className={`
                          h-11
                          rounded-xl
                          border
                          text-sm
                          font-semibold
                          transition-all
                          duration-200
                          ${
                            active
                              ? `
                                
                                text-black
                                ring-2
                                ring-indigo-500/10
                              `
                              : `
                                border-gray-200
                                bg-white
                                text-gray-500
                                
                              `
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* =================================================
                LISTING INFORMATION
            ================================================= */}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    
                    text-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Listing Information
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Listing and feed details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* EXPIRATION DATE */}

                <div>
                  <label className={labelClass}>
                    Next Listing Expiration Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        pointer-events-none
                      "
                    />

                    <input
                      type="date"
                      name="nextListingExpirationDate"
                      value={
                        form.nextListingExpirationDate
                      }
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* LISTING ID */}

                <div>
                  <label className={labelClass}>
                    Listing ID
                  </label>

                  <div className="relative">
                    <Hash
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      name="listingId"
                      value={form.listingId}
                      onChange={handleChange}
                      placeholder="Listing ID"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* FEED DATA LINK */}

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Feed Data Link
                  </label>

                  <div className="relative">
                    <Rss
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="url"
                      name="feedDataLink"
                      value={form.feedDataLink}
                      onChange={handleChange}
                      placeholder="https://example.com/feed"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                ECBYO / PMS
            ================================================= */}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    
                    text-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  <KeyRound size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    ECBYO & PMS
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Property management information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ECBYO PASS */}

                <div>
                  <label className={labelClass}>
                    ECBYO Pass
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      name="ecbyoPass"
                      value={form.ecbyoPass}
                      onChange={handleChange}
                      placeholder="ECBYO password"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* PMS */}

                <div>
                  <label className={labelClass}>
                    What PMS does this company use?
                  </label>

                  <div className="relative">
                    <Server
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      name="pmsUsed"
                      value={form.pmsUsed}
                      onChange={handleChange}
                      placeholder="e.g. Guesty, Hostaway"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                UNITS
            ================================================= */}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    text-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2 size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Units
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Property unit information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* TOTAL UNITS */}

                <div>
                  <label className={labelClass}>
                    Total Number of Units Managed
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="totalUnitsManaged"
                    value={
                      form.totalUnitsManaged
                    }
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>

                {/* ECBYO UNITS */}

                <div>
                  <label className={labelClass}>
                    Number of Units on ECBYO
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="unitsOnEcbyo"
                    value={form.unitsOnEcbyo}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              sticky
              bottom-0
              px-6
              py-4
              border-t
              border-gray-100
              bg-white
              flex
              items-center
              justify-end
              gap-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                h-11
                px-5
                rounded-xl
                border
                border-gray-200
                bg-white
                text-gray-600
                text-sm
                font-semibold
                hover:bg-gray-50
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                h-11
                px-6
                rounded-xl
                bg-[#4B49AC]
                text-white
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                shadow-indigo-500/20
                hover:bg-[#403e99]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Save size={17} />

                  Create Organization
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}