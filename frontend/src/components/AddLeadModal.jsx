import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  X,
  UserRound,
  Building2,
  BriefcaseBusiness,
  Phone,
  Mail,
  Plus,
  Trash2,
  DollarSign,
  Radio,
  Hash,
  CalendarDays,
  Save,
  Loader2,
  Search,
} from "lucide-react";

export default function AddLeadModal({
  onClose,
  onCreated,
}) {
  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    organization: "",
    title: "",
    value: "",
    sourceChannel: "",
    sourceChannelId: "",
    expectedCloseDate: "",
  });

  // =====================================================
  // ORGANIZATIONS
  // =====================================================

  const [organizations, setOrganizations] = useState([]);
  const [organizationSearch, setOrganizationSearch] =
    useState("");

  const [loadingOrganizations, setLoadingOrganizations] =
    useState(false);

  // =====================================================
  // PHONES
  // =====================================================

  const [phones, setPhones] = useState([
    {
      number: "",
      label: "work",
    },
  ]);

  // =====================================================
  // EMAILS
  // =====================================================

  const [emails, setEmails] = useState([
    {
      address: "",
      label: "work",
    },
  ]);

  // =====================================================
  // SAVING
  // =====================================================

  const [saving, setSaving] = useState(false);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORGANIZATIONS
  // =====================================================

  const fetchOrganizations = async () => {
    try {
      setLoadingOrganizations(true);

      const res = await api.get("/organizations");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setOrganizations(data);
    } catch (err) {
      console.error(
        "FETCH ORGANIZATIONS ERROR:",
        err.response?.data || err.message
      );

      setOrganizations([]);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchOrganizations();
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
  // PHONE CHANGE
  // =====================================================

  const handlePhoneChange = (index, value) => {
    setPhones((prev) =>
      prev.map((phone, i) =>
        i === index
          ? {
              ...phone,
              number: value,
            }
          : phone
      )
    );

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // PHONE LABEL
  // =====================================================

  const handlePhoneLabelChange = (
    index,
    value
  ) => {
    setPhones((prev) =>
      prev.map((phone, i) =>
        i === index
          ? {
              ...phone,
              label: value,
            }
          : phone
      )
    );
  };

  // =====================================================
  // EMAIL CHANGE
  // =====================================================

  const handleEmailChange = (
    index,
    value
  ) => {
    setEmails((prev) =>
      prev.map((email, i) =>
        i === index
          ? {
              ...email,
              address: value,
            }
          : email
      )
    );

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // EMAIL LABEL
  // =====================================================

  const handleEmailLabelChange = (
    index,
    value
  ) => {
    setEmails((prev) =>
      prev.map((email, i) =>
        i === index
          ? {
              ...email,
              label: value,
            }
          : email
      )
    );
  };

  // =====================================================
  // ADD PHONE
  // =====================================================

  const addPhone = () => {
    setPhones((prev) => [
      ...prev,
      {
        number: "",
        label: "work",
      },
    ]);
  };

  // =====================================================
  // REMOVE PHONE
  // =====================================================

  const removePhone = (index) => {
    if (phones.length === 1) {
      return;
    }

    setPhones((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // ADD EMAIL
  // =====================================================

  const addEmail = () => {
    setEmails((prev) => [
      ...prev,
      {
        address: "",
        label: "work",
      },
    ]);
  };

  // =====================================================
  // REMOVE EMAIL
  // =====================================================

  const removeEmail = (index) => {
    if (emails.length === 1) {
      return;
    }

    setEmails((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // FILTER ORGANIZATIONS
  // =====================================================

  const filteredOrganizations =
    organizations.filter((organization) =>
      (organization.name || "")
        .toLowerCase()
        .includes(
          organizationSearch
            .toLowerCase()
            .trim()
        )
    );

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
      setError("Contact person name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),

        title: form.title.trim(),

        value:
          form.value === ""
            ? 0
            : Number(form.value),

        sourceChannel:
          form.sourceChannel.trim(),

        sourceChannelId:
          form.sourceChannelId.trim(),

        expectedCloseDate:
          form.expectedCloseDate || null,

        phone: phones
          .filter(
            (phone) =>
              phone.number.trim()
          )
          .map((phone) => ({
            number:
              phone.number.trim(),
            label: phone.label,
          })),

        email: emails
          .filter(
            (email) =>
              email.address.trim()
          )
          .map((email) => ({
            address:
              email.address.trim(),
            label: email.label,
          })),
      };

      // Organization only if selected
      if (form.organization) {
        payload.organization =
          form.organization;
      }

      console.log(
        "CREATE LEAD PAYLOAD:",
        payload
      );

      const res = await api.post(
        "/leads",
        payload
      );

      console.log(
        "LEAD CREATED:",
        res.data
      );

      if (onCreated) {
        onCreated(res.data);
      }

      onClose();

    } catch (err) {
      console.error(
        "CREATE LEAD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create lead."
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
          max-w-[650px]
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
        onMouseDown={(e) =>
          e.stopPropagation()
        }
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
              <UserRound size={23} />
            </div>

            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-gray-800
                "
              >
                Add Lead
              </h2>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-0.5
                "
              >
                Create a new lead
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
            FORM
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

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
                "
              >

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
                  <UserRound size={19} />
                </div>

                <div>

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-gray-800
                    "
                  >
                    Basic Information
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Basic contact information
                  </p>

                </div>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                {/* NAME */}

                <div>

                  <label className={labelClass}>
                    Contact Person
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

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter contact name"
                      className={`${inputClass} pl-10`}
                      autoFocus
                    />

                  </div>

                </div>

                {/* TITLE */}

                <div>

                  <label className={labelClass}>
                    Job Title
                  </label>

                  <div className="relative">

                    <BriefcaseBusiness
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
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Manager"
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                </div>

                {/* ORGANIZATION */}

                <div className="md:col-span-2">

                  <label className={labelClass}>
                    Organization
                  </label>

                  <div className="relative mb-2">

                    <Search
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
                      type="text"
                      value={
                        organizationSearch
                      }
                      onChange={(e) =>
                        setOrganizationSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search organization..."
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                  <div className="relative">

                    <Building2
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
                      name="organization"
                      value={
                        form.organization
                      }
                      onChange={handleChange}
                      disabled={
                        loadingOrganizations
                      }
                      className={`
                        ${inputClass}
                        pl-10
                        pr-10
                        appearance-none
                        cursor-pointer
                        disabled:bg-gray-50
                        disabled:cursor-wait
                      `}
                    >

                      <option value="">
                        {loadingOrganizations
                          ? "Loading organizations..."
                          : "Select organization"}
                      </option>

                      {filteredOrganizations.map(
                        (organization) => (
                          <option
                            key={
                              organization._id
                            }
                            value={
                              organization._id
                            }
                          >
                            {organization.name}
                          </option>
                        )
                      )}

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

              </div>

            </section>

            {/* =================================================
                CONTACT
            ================================================= */}

            <section>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
                "
              >

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
                  <Phone size={19} />
                </div>

                <div>

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-gray-800
                    "
                  >
                    Contact Information
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Phone numbers and email addresses
                  </p>

                </div>

              </div>

              {/* PHONE */}

              <div className="mb-5">

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  "
                >

                  <label
                    className="
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Phone
                  </label>

                  <button
                    type="button"
                    onClick={addPhone}
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-semibold
                      text-[#4B49AC]
                      hover:text-indigo-700
                    "
                  >
                    <Plus size={14} />
                    Add phone
                  </button>

                </div>

                <div className="space-y-2">

                  {phones.map(
                    (phone, index) => (
                      <div
                        key={index}
                        className="
                          flex
                          gap-2
                        "
                      >

                        <div className="relative flex-1">

                          <Phone
                            size={15}
                            className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              text-gray-400
                            "
                          />

                          <input
                            type="text"
                            value={
                              phone.number
                            }
                            onChange={(e) =>
                              handlePhoneChange(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Phone number"
                            className={`${inputClass} pl-9`}
                          />

                        </div>

                        <select
                          value={phone.label}
                          onChange={(e) =>
                            handlePhoneLabelChange(
                              index,
                              e.target.value
                            )
                          }
                          className="
                            h-11
                            px-3
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-sm
                            text-gray-600
                            outline-none
                            cursor-pointer
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

                        {phones.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removePhone(
                                index
                              )
                            }
                            className="
                              w-11
                              h-11
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              text-gray-400
                              hover:text-red-500
                              hover:bg-red-50
                              transition
                            "
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  "
                >

                  <label
                    className="
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Email
                  </label>

                  <button
                    type="button"
                    onClick={addEmail}
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-semibold
                      text-[#4B49AC]
                      hover:text-indigo-700
                    "
                  >
                    <Plus size={14} />
                    Add email
                  </button>

                </div>

                <div className="space-y-2">

                  {emails.map(
                    (email, index) => (
                      <div
                        key={index}
                        className="
                          flex
                          gap-2
                        "
                      >

                        <div className="relative flex-1">

                          <Mail
                            size={15}
                            className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              text-gray-400
                            "
                          />

                          <input
                            type="email"
                            value={
                              email.address
                            }
                            onChange={(e) =>
                              handleEmailChange(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Email address"
                            className={`${inputClass} pl-9`}
                          />

                        </div>

                        <select
                          value={email.label}
                          onChange={(e) =>
                            handleEmailLabelChange(
                              index,
                              e.target.value
                            )
                          }
                          className="
                            h-11
                            px-3
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-sm
                            text-gray-600
                            outline-none
                            cursor-pointer
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

                        {emails.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeEmail(
                                index
                              )
                            }
                            className="
                              w-11
                              h-11
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              text-gray-400
                              hover:text-red-500
                              hover:bg-red-50
                              transition
                            "
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </div>
                    )
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                LEAD INFORMATION
            ================================================= */}

            <section>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
                "
              >

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
                  <BriefcaseBusiness size={19} />
                </div>

                <div>

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-gray-800
                    "
                  >
                    Lead Information
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Lead value and source details
                  </p>

                </div>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                {/* VALUE */}

                <div>

                  <label className={labelClass}>
                    Lead Value
                  </label>

                  <div className="relative">

                    <DollarSign
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
                      type="number"
                      min="0"
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                </div>

                {/* EXPECTED CLOSE */}

                <div>

                  <label className={labelClass}>
                    Expected Close Date
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
                      name="expectedCloseDate"
                      value={
                        form.expectedCloseDate
                      }
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                </div>

                {/* SOURCE CHANNEL */}

                <div>

                  <label className={labelClass}>
                    Source Channel
                  </label>

                  <div className="relative">

                    <Radio
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
                      name="sourceChannel"
                      value={
                        form.sourceChannel
                      }
                      onChange={handleChange}
                      placeholder="e.g. Website"
                      className={`${inputClass} pl-10`}
                    />

                  </div>

                </div>

                {/* SOURCE ID */}

                <div>

                  <label className={labelClass}>
                    Source Channel ID
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
                      name="sourceChannelId"
                      value={
                        form.sourceChannelId
                      }
                      onChange={handleChange}
                      placeholder="Source ID"
                      className={`${inputClass} pl-10`}
                    />

                  </div>

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

                  Create Lead
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}