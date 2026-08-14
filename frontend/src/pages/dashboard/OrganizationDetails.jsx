import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import EditableField from "../../components/EditableField";
import EditableContactField from "../../components/EditableContactField";
import EditableLinkField from "../../components/EditableLinkField";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { CiUser } from "react-icons/ci";

import OwnerTransferDropdown from "../../components/ OwnerTransferDropdown";
import RightPanel from "../../components/RightSidePanel/RightPanel";

import {
  Search,
  X,
  Building2,
  Plus,
  Link2,
  Users,
  Globe,
  Mail,
  Phone,
  BriefcaseBusiness,
  MapPin,
  ChevronRight,
  Check,
  UserRound,
} from "lucide-react";

export default function OrganizationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);

  const [openDetails, setOpenDetails] = useState(true);
  const [openPeople, setOpenPeople] = useState(true);

  const [availableLeads, setAvailableLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);

  // ==========================================
  // FETCH ORGANIZATION
  // ==========================================

  const fetchOrganization = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/organizations/${id}`);

      setOrganization(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH LEADS
  // ==========================================

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");

      setAvailableLeads(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchOrganization();
    fetchLeads();
  }, [id]);

  // ==========================================
  // ADD LEAD
  // ==========================================

  const handleAddLead = async () => {
    if (!selectedLead || linking) return;

    try {
      setLinking(true);

      await api.put(
        `/organizations/${organization._id}/add-lead`,
        {
          leadId: selectedLead,
        }
      );

      setSelectedLead("");
      setLeadSearch("");
      setShowLeadModal(false);

      await fetchOrganization();
    } catch (err) {
      console.log(err);
    } finally {
      setLinking(false);
    }
  };

  // ==========================================
  // REMOVE LEAD
  // ==========================================

  const handleRemoveLead = async (leadId) => {
    try {
      await api.put(
        `/organizations/${organization._id}/remove-lead`,
        {
          leadId,
        }
      );

      fetchOrganization();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // FILTER PEOPLE
  // ==========================================

  const linkedLeadIds =
    organization?.leads?.map((lead) => lead._id) || [];

  const filteredLeads = availableLeads.filter((lead) => {
    const text = leadSearch.trim().toLowerCase();

    const alreadyLinked = linkedLeadIds.includes(
      lead._id
    );

    if (alreadyLinked) return false;

    if (!text) return true;

    const name =
      lead.name?.toLowerCase() || "";

    const email =
      lead.email?.[0]?.address?.toLowerCase() || "";

    const phone =
      String(
        lead.phone?.[0]?.number || ""
      ).toLowerCase();

    const title =
      lead.title?.toLowerCase() || "";

    return (
      name.includes(text) ||
      email.includes(text) ||
      phone.includes(text) ||
      title.includes(text)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading || !organization) {
    return (
      <div className="h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-indigo-100
              border-t-indigo-600
              animate-spin
            "
          />

          <p className="text-sm text-gray-500">
            Loading organization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        h-screen
        flex
        flex-col
        bg-[#f6f7fb]
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          flex
          items-center
          justify-between
          px-6
          py-4
          bg-white
          
    
          flex-shrink-0
          
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-4 min-w-0">

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-[#4B49AC]
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              shadow-indigo-500/20
              flex-shrink-0
            "
          >
            <Building2 size={24} />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

            <div className="text-lg font-bold text-gray-800 min-w-0">
  <EditableField
    label="Organization name"
    field="name"
    value={organization.name}
    itemId={organization._id}
    endpoint="organizations"
    variant="header"
    onUpdate={setOrganization}
  />
</div>

            </div>

            <div className="flex items-center gap-2 mt-1">

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  text-gray-400
                "
              >
                <Building2 size={12} />

                Organization
              </span>

              {organization.industry && (
                <>
                  <span className="text-gray-300">
                    •
                  </span>

                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {organization.industry}
                  </span>
                </>
              )}

            </div>

          </div>
        </div>

        {/* OWNER */}

        <OwnerTransferDropdown
          owner={organization.owner}
          entityId={organization._id}
          entityType="organizations"
          onSuccess={setOrganization}
        />
      </header>

      {/* =====================================================
          BODY
      ====================================================== */}

      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ===================================================
            LEFT SIDEBAR
        ==================================================== */}

        <aside
          className="
            w-[370px]
            flex-shrink-0
            bg-white
            border-r
            border-gray-200
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >

          <div className="p-5">

            {/* =================================================
                QUICK SUMMARY
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-gradient-to-br
                from-white
                to-gray-50
                p-4
                mb-5
              "
            >

              <div className="flex items-center justify-between mb-4">

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                  >
                    Quick Info
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                      mt-1
                    "
                  >
                    Organization details
                  </p>

                </div>

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-indigo-50
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2 size={16} />
                </div>

              </div>

              <div className="space-y-2">

                <div className="flex items-center gap-2">

                  <Mail
                    size={14}
                    className="text-gray-400"
                  />

                  <div className="flex-1 min-w-0">

                    <EditableContactField
                      label="email"
                      field="email"
                      value={organization.email}
                      type={
                        organization.email?.[0]?.label ||
                        "Work"
                      }
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <Phone
                    size={14}
                    className="text-gray-400"
                  />

                  <div className="flex-1 min-w-0">

                    <EditableContactField
                      label="phone"
                      field="phone"
                      value={organization.phone}
                      type={
                        organization.phone?.[0]?.label ||
                        "Work"
                      }
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                bg-white
                overflow-hidden
                mb-5
              "
            >

              <button
                type="button"
                onClick={() =>
                  setOpenDetails(!openDetails)
                }
                className="
                  w-full
                  px-4
                  py-3.5
                  flex
                  items-center
                  justify-between
                  hover:bg-gray-50
                  transition
                "
              >

                <div className="flex items-center gap-2">

                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <BriefcaseBusiness size={16} />
                  </div>

                  <div className="text-left">

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Details
                    </p>

                    <p
                      className="
                        text-[11px]
                        text-gray-400
                      "
                    >
                      Organization information
                    </p>

                  </div>

                </div>

                {openDetails ? (
                  <IoIosArrowUp
                    className="text-gray-400"
                  />
                ) : (
                  <IoIosArrowDown
                    className="text-gray-400"
                  />
                )}

              </button>

              {openDetails && (
                <div
                  className="
                    px-4
                    pb-4
                    pt-1
                    border-t
                    border-gray-100
                  "
                >

                  <div className="space-y-3 text-sm">

                    <EditableField
                      label="Name"
                      field="name"
                      value={organization.name}
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                    <EditableLinkField
                      label="Website"
                      field="website"
                      value={organization.website}
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                    <EditableField
                      label="Phone"
                      field="phone"
                      value={organization.phone}
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                    <EditableField
                      label="Email"
                      field="email"
                      value={organization.email}
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                    <EditableField
                      label="Industry"
                      field="industry"
                      value={organization.industry}
                      itemId={organization._id}
                      endpoint="organizations"
                      onUpdate={setOrganization}
                    />

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                bg-white
                overflow-hidden
                mb-5
              "
            >

              <div
                className="
                  px-4
                  py-3.5
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-emerald-50
                    text-emerald-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MapPin size={16} />
                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Address
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Location information
                  </p>

                </div>

              </div>

              <div
                className="
                  px-4
                  pb-4
                  pt-1
                  border-t
                  border-gray-100
                "
              >

                <div className="space-y-3">

                  <EditableField
                    label="Street"
                    field="address.street"
                    value={
                      organization.address?.street
                    }
                    itemId={organization._id}
                    endpoint="organizations"
                    onUpdate={setOrganization}
                  />

                  <EditableField
                    label="City"
                    field="address.city"
                    value={
                      organization.address?.city
                    }
                    itemId={organization._id}
                    endpoint="organizations"
                    onUpdate={setOrganization}
                  />

                  <EditableField
                    label="State"
                    field="address.state"
                    value={
                      organization.address?.state
                    }
                    itemId={organization._id}
                    endpoint="organizations"
                    onUpdate={setOrganization}
                  />

                  <EditableField
                    label="Country"
                    field="address.country"
                    value={
                      organization.address?.country
                    }
                    itemId={organization._id}
                    endpoint="organizations"
                    onUpdate={setOrganization}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                PEOPLE
            ================================================= */}

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                bg-white
                overflow-hidden
              "
            >

              {/* HEADER */}

              <div
                className="
                  px-4
                  py-3
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenPeople(!openPeople)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    flex-1
                    text-left
                  "
                >

                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-[#4B49AC]
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Users size={16} />
                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      People
                    </p>

                    <p
                      className="
                        text-[11px]
                        text-gray-400
                      "
                    >
                      {organization.leads?.length || 0} linked
                    </p>

                  </div>

                  {openPeople ? (
                    <IoIosArrowUp
                      className="ml-auto text-gray-400"
                    />
                  ) : (
                    <IoIosArrowDown
                      className="ml-auto text-gray-400"
                    />
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowLeadModal(true)
                  }
                  title="Link person"
                  className="
                    ml-2
                    w-8
                    h-8
                    rounded-lg
                    bg-[#4B49AC]
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                    shadow-indigo-500/20
                    hover:bg-indigo-700
                    hover:scale-105
                    transition
                  "
                >
                  <Plus size={17} />
                </button>

              </div>

              {/* PEOPLE LIST */}

              {openPeople && (
                <div className="p-3">

                  {organization.leads?.length > 0 ? (

                    <div className="space-y-2">

                      {organization.leads.map(
                        (lead) => (
                          <div
                            key={lead._id}
                            className="
                              group
                              p-3
                              rounded-xl
                              border
                              border-transparent
                              hover:border-indigo-100
                              hover:bg-indigo-50/50
                              transition
                            "
                          >

                            <div className="flex items-center gap-3">

                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-xl
                                  bg-[#4B49AC]
                                  text-white
                                  flex
                                  items-center
                                  justify-center
                                  flex-shrink-0
                                "
                              >
                                <UserRound
                                  size={17}
                                />
                              </div>

                              <div className="flex-1 min-w-0">

                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    truncate
                                  "
                                >
                                  {lead.name ||
                                    "Unnamed Person"}
                                </p>

                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                    truncate
                                    mt-0.5
                                  "
                                >
                                  {lead.title ||
                                    lead.email?.[0]
                                      ?.address ||
                                    "Person"}
                                </p>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/app/leads/${lead._id}`
                                  )
                                }
                                title="View person"
                                className="
                                  w-8
                                  h-8
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  text-gray-300
                                  hover:bg-white
                                  hover:text-indigo-600
                                  transition
                                "
                              >
                                <ChevronRight
                                  size={17}
                                />
                              </button>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  ) : (

                    <div
                      className="
                        py-7
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          w-11
                          h-11
                          rounded-xl
                          bg-gray-100
                          text-gray-400
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Users size={20} />
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        No people linked
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400
                          mt-1
                        "
                      >
                        Connect a person to this organization.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowLeadModal(true)
                        }
                        className="
                          mt-4
                          inline-flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          rounded-xl
                          bg-[#4B49AC]
                          text-white
                          text-xs
                          font-semibold
                          hover:bg-indigo-700
                          transition
                        "
                      >
                        <Plus size={15} />
                        Link Person
                      </button>

                    </div>

                  )}

                </div>
              )}

            </div>

          </div>
        </aside>

        {/* ===================================================
            RIGHT PANEL
        ==================================================== */}

        <main
          className="
            flex-1
            min-w-0
            min-h-0
            overflow-y-auto
            bg-[#f6f7fb]
            p-5
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >

          <RightPanel
            type="organization"
            data={organization}
            setData={setOrganization}
          />

        </main>

      </div>

      {/* =====================================================
          LINK PERSON MODAL
      ====================================================== */}

      {showLeadModal && (

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
            if (
              e.target === e.currentTarget
            ) {
              setShowLeadModal(false);
              setLeadSearch("");
              setSelectedLead("");
            }
          }}
        >

          <div
            className="
              w-full
              max-w-[560px]
              bg-white
              rounded-3xl
              border
              border-gray-200
              shadow-[0_25px_80px_rgba(15,23,42,0.25)]
              overflow-hidden
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                px-6
                py-5
                border-b
                border-gray-100
                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Link2 size={21} />
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-gray-800
                    "
                  >
                    Link Person
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-400
                      mt-0.5
                    "
                  >
                    Connect a person with this organization
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLeadModal(false);
                  setLeadSearch("");
                  setSelectedLead("");
                }}
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
                "
              >
                <X size={19} />
              </button>

            </div>

            {/* SEARCH */}

            <div className="px-6 pt-5">

              <div className="relative">

                <Search
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    pointer-events-none
                  "
                />

                <input
                  autoFocus
                  type="text"
                  placeholder="Search people..."
                  value={leadSearch}
                  onChange={(e) =>
                    setLeadSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-12
                    pl-11
                    pr-4
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    text-sm
                    text-gray-700
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    
                  "
                />

              </div>

              <div className="flex items-center justify-between mt-3">

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {filteredLeads.length}{" "}
                  {filteredLeads.length === 1
                    ? "person"
                    : "people"}{" "}
                  available
                </p>

                {leadSearch && (
                  <button
                    type="button"
                    onClick={() =>
                      setLeadSearch("")
                    }
                    className="
                      text-xs
                      font-medium
                      text-indigo-600
                      hover:text-indigo-700
                    "
                  >
                    Clear
                  </button>
                )}

              </div>

            </div>

            {/* PEOPLE */}

            <div className="px-6 py-4">

              <div
                className="
                  max-h-[330px]
                  overflow-y-auto
                  space-y-2
                  pr-1
                  scrollbar-thin
                  scrollbar-thumb-gray-200
                "
              >

                {filteredLeads.length > 0 ? (

                  filteredLeads.map((lead) => {

                    const selected =
                      selectedLead === lead._id;

                    return (
                      <button
                        type="button"
                        key={lead._id}
                        onClick={() =>
                          setSelectedLead(
                            lead._id
                          )
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-2xl
                          border
                          text-left
                          transition-all
                          duration-200
                          ${
                            selected
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-transparent hover:border-indigo-100 hover:bg-indigo-50/60"
                          }
                        `}
                      >

                        {/* AVATAR */}

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-gradient-to-br
                            from-indigo-500
                            to-violet-500
                            text-white
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            shadow-sm
                          "
                        >
                          <UserRound
                            size={20}
                          />
                        </div>

                        {/* INFO */}

                        <div className="flex-1 min-w-0">

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-800
                              truncate
                            "
                          >
                            {lead.name ||
                              "Unnamed Person"}
                          </p>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mt-1
                            "
                          >

                            {lead.title && (
                              <span
                                className="
                                  text-[11px]
                                  text-gray-400
                                  truncate
                                  max-w-[140px]
                                "
                              >
                                {lead.title}
                              </span>
                            )}

                            {lead.email?.[0]
                              ?.address && (
                              <>
                                {lead.title && (
                                  <span className="text-gray-300">
                                    •
                                  </span>
                                )}

                                <span
                                  className="
                                    text-[11px]
                                    text-gray-400
                                    truncate
                                    max-w-[180px]
                                  "
                                >
                                  {
                                    lead.email[0]
                                      .address
                                  }
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                        {/* CHECK */}

                        <div
                          className={`
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            transition
                            ${
                              selected
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-300"
                            }
                          `}
                        >
                          <Check size={16} />
                        </div>

                      </button>
                    );
                  })

                ) : (

                  <div
                    className="
                      py-10
                      text-center
                    "
                  >

                    <div
                      className="
                        mx-auto
                        w-14
                        h-14
                        rounded-2xl
                        bg-gray-100
                        text-gray-400
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <UserRound size={25} />
                    </div>

                    <h3
                      className="
                        mt-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      No people found
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-1
                      "
                    >
                      Try another search term.
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* FOOTER */}

            <div
              className="
                px-6
                py-4
                border-t
                border-gray-100
                bg-gray-50/70
                flex
                items-center
                gap-3
              "
            >

              <button
                type="button"
                onClick={() => {
                  setShowLeadModal(false);
                  setLeadSearch("");
                  setSelectedLead("");
                }}
                className="
                  flex-1
                  h-11
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  text-sm
                  font-semibold
                  hover:bg-gray-100
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!selectedLead || linking}
                onClick={handleAddLead}
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-indigo-600
                  text-white
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-md
                  shadow-indigo-500/20
                  hover:bg-indigo-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition
                "
              >
                {linking ? (
                  <>
                    <span
                      className="
                        w-4
                        h-4
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                        animate-spin
                      "
                    />
                    Linking...
                  </>
                ) : (
                  <>
                    <Link2 size={17} />
                    Link Person
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}