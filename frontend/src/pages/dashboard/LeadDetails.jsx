import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";

import EditableField from "../../components/EditableField";
import EditableContactField from "../../components/EditableContactField";
import EditableLinkField from "../../components/EditableLinkField";
import OwnerTransferDropdown from "../../components/ OwnerTransferDropdown";
import RightPanel from "../../components/RightSidePanel/RightPanel";
import { UserRound } from "lucide-react";
import {
  Search,
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  BriefcaseBusiness,
  Plus,
  Link2,
  Unlink,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";


// ======================================================
// ORGANIZATION FIELDS
// ======================================================

const organizationFields = [
  {
    label: "Current Booking Pal Account",
    field: "currentBookingPalAccount",
  },
  {
    label: "Next Listing Expiration Date",
    field: "nextListingExpirationDate",
  },
  {
    label: "ECBYO Discount",
    field: "ecbyoDiscount",
  },
  {
    label: "ECBYO Login Email",
    field: "ecbyoLoginEmail",
  },
  {
    label: "ECBYO Pass",
    field: "ecbyoPass",
  },
  {
    label: "What VRS do they use?",
    field: "vrsUsed",
  },
  {
    label: "VRS ID",
    field: "vrsId",
  },
  {
    label: "Months of credit",
    field: "monthsOfCredit",
  },
  {
    label: "Total number of units managed",
    field: "totalUnitsManaged",
  },
];


// ======================================================
// LEAD DETAILS
// ======================================================

export default function LeadDetails() {
  const { id } = useParams();

  // ====================================================
  // LEAD
  // ====================================================

  const [lead, setLead] = useState(null);

  const [loading, setLoading] = useState(true);

  // ====================================================
  // DETAILS
  // ====================================================

  const [openDetails, setOpenDetails] = useState(true);

  const [fieldSearch, setFieldSearch] = useState("");

  // ====================================================
  // ORGANIZATION
  // ====================================================

  const [openOrganization, setOpenOrganization] =
    useState(true);

  const [
    availableOrganizations,
    setAvailableOrganizations,
  ] = useState([]);

  const [
    organizationSearch,
    setOrganizationSearch,
  ] = useState("");

  const [
    showOrganizationModal,
    setShowOrganizationModal,
  ] = useState(false);

  const [
    showAddOrganizationModal,
    setShowAddOrganizationModal,
  ] = useState(false);

  const [
    linkingOrganization,
    setLinkingOrganization,
  ] = useState(false);

  const [
    organizationLoading,
    setOrganizationLoading,
  ] = useState(false);


  // ====================================================
  // FETCH LEAD
  // ====================================================

  const fetchLead = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/leads/${id}`);

      setLead(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch lead:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // ====================================================
  // FETCH ORGANIZATIONS
  // ====================================================

  const fetchOrganizations = async () => {
    try {
      setOrganizationLoading(true);

      const res = await api.get("/organizations");

      setAvailableOrganizations(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch organizations:",
        error
      );

      setAvailableOrganizations([]);
    } finally {
      setOrganizationLoading(false);
    }
  };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchLead();
    fetchOrganizations();
  }, [id]);


  // ====================================================
  // UNLINK ORGANIZATION
  // ====================================================

  const handleUnlinkOrganization = async () => {
    if (!lead?._id) return;

    try {
      const res = await api.put(
        `/leads/${lead._id}`,
        {
          organization: null,
        }
      );

      setLead(res.data);
    } catch (error) {
      console.error(
        "Failed to unlink organization:",
        error
      );
    }
  };


  // ====================================================
  // LINK ORGANIZATION
  // ====================================================

  const handleLinkOrganization = async (
    organizationId
  ) => {
    if (!lead?._id || !organizationId) return;

    try {
      setLinkingOrganization(true);

      const res = await api.put(
        `/leads/${lead._id}`,
        {
          organization: organizationId,
        }
      );

      setLead(res.data);

      setShowOrganizationModal(false);

      setOrganizationSearch("");
    } catch (error) {
      console.error(
        "Failed to link organization:",
        error
      );
    } finally {
      setLinkingOrganization(false);
    }
  };


  // ====================================================
  // ORGANIZATION UPDATE
  // ====================================================

  const handleOrganizationUpdate = (
    updatedOrganization
  ) => {
    setLead((previousLead) => ({
      ...previousLead,
      organization: updatedOrganization,
    }));
  };


  // ====================================================
  // FILTER ORGANIZATIONS
  // ====================================================

  const filteredOrganizations =
    availableOrganizations.filter((org) => {
      const query =
        organizationSearch
          .trim()
          .toLowerCase();

      if (!query) return true;

      const name =
        org.name?.toLowerCase() || "";

      const industry =
        org.industry?.toLowerCase() || "";

      const website =
        org.website?.toLowerCase() || "";

      return (
        name.includes(query) ||
        industry.includes(query) ||
        website.includes(query)
      );
    });


  // ====================================================
  // FILTER LEAD DETAILS
  // ====================================================

  const leadFields = [
    {
      label: "Name",
      field: "name",
      value: lead?.name,
      type: "field",
    },
    {
      label: "Email",
      field: "email",
      value: lead?.email?.[0]?.address,
      type: "field",
    },
    {
      label: "Phone",
      field: "phone",
      value: lead?.phone?.[0]?.number,
      type: "field",
    },
    {
      label: "Title",
      field: "title",
      value: lead?.title,
      type: "field",
    },
    {
      label: "Website",
      field: "website",
      value: lead?.website,
      type: "link",
    },
    {
      label: "Facebook",
      field: "facebook",
      value: lead?.facebook,
      type: "link",
    },
    {
      label: "Instagram",
      field: "instagram",
      value: lead?.instagram,
      type: "link",
    },
  ];


  const filteredLeadFields =
    leadFields.filter((item) =>
      item.label
        .toLowerCase()
        .includes(
          fieldSearch
            .trim()
            .toLowerCase()
        )
    );


  // ====================================================
  // LOADING UI
  // ====================================================

  if (loading) {
    return (
      <div
        className="
          h-full
          min-h-[500px]
          flex
          items-center
          justify-center
          bg-gray-50
        "
      >
        <div className="flex flex-col items-center gap-4">

          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-indigo-100
              border-t-[#4B49AC]
              animate-spin
            "
          />

          <p className="text-sm text-gray-400">
            Loading lead...
          </p>

        </div>
      </div>
    );
  }


  // ====================================================
  // LEAD NOT FOUND
  // ====================================================

  if (!lead) {
    return (
      <div
        className="
          h-full
          min-h-[500px]
          flex
          items-center
          justify-center
          bg-gray-50
        "
      >
        <div className="text-center">

          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-2xl
              bg-gray-100
              text-gray-400
              flex
              items-center
              justify-center
            "
          >
            <User size={25} />
          </div>

          <h2
            className="
              mt-4
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Lead not found
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-gray-400
            "
          >
            The requested lead could not be loaded.
          </p>

        </div>
      </div>
    );
  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        h-full
        min-h-0
        flex
        flex-col
        bg-gray-50
        overflow-hidden
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className="
          h-[76px]
          flex-shrink-0
          flex
          items-center
          justify-between
          px-5
          bg-white
          border-b
          border-gray-200
          shadow-sm
          z-20
        "
      >

        {/* -----------------------------------------------
            LEAD INFO
        ------------------------------------------------ */}

        <div className="flex items-center gap-3 min-w-0">

          {/* AVATAR */}

         <div
  className="
    w-11
    h-11
    rounded-full
    bg-[#F5F7FF]
    text-[#4B49AC]
    flex
    items-center
    justify-center
    shadow-sm
    shadow-indigo-500/10
    flex-shrink-0
  "
>
  <UserRound
    size={32}
    strokeWidth={1.8}
  />
</div>


          {/* NAME */}

          <div className="min-w-0">

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h1
                className="
                  text-lg
                  font-bold
                  text-gray-800
                  truncate
                "
              >
                <EditableField
                  field="name"
                  value={lead.name}
                  leadId={lead._id}
                  onUpdate={setLead}
                />
              </h1>


             

            </div>


             
          </div>

        </div>


        {/* -----------------------------------------------
            OWNER
        ------------------------------------------------ */}

        <OwnerTransferDropdown
          owner={lead.owner}
          entityId={lead._id}
          entityType="leads"
          onSuccess={setLead}
        />

      </header>


      {/* ==================================================
          BODY
      ================================================== */}

      <div
        className="
          flex
          flex-1
          min-h-0
          overflow-hidden
        "
      >

        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside
          className="
            w-[370px]
            flex-shrink-0
            bg-white
            border-r
            border-gray-200
            overflow-y-auto
            min-h-0
            p-5
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >

          {/* =================================================
              FIELD SEARCH
          ================================================= */}

          <div className="relative mb-5">

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
              placeholder="Filter fields..."
              value={fieldSearch}
              onChange={(e) =>
                setFieldSearch(
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                pl-10
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
                duration-200
                hover:border-indigo-300
                hover:bg-white
                focus:bg-white
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
            />

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <section
            className="
              p-4
              rounded-2xl
              bg-gray-50/70
              border
              border-gray-100
              mb-4
            "
          >

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
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                <User size={16} />
              </div>

              <div>

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  Summary
                </h3>

                <p
                  className="
                    text-[11px]
                    text-gray-400
                    mt-0.5
                  "
                >
                  Primary contact information
                </p>

              </div>

            </div>


            <div className="space-y-2">

              <EditableContactField
                label="email"
                field="email"
                value={
                  lead.email?.[0]?.address
                }
                type={
                  lead.email?.[0]?.label ||
                  "Work"
                }
                itemId={lead._id}
                endpoint="leads"
                onUpdate={setLead}
              />

              <EditableContactField
                label="phone"
                field="phone"
                value={
                  lead.phone?.[0]?.number
                }
                type={
                  lead.phone?.[0]?.label ||
                  "Work"
                }
                itemId={lead._id}
                endpoint="leads"
                onUpdate={setLead}
              />

            </div>

          </section>


          {/* =================================================
              DETAILS
          ================================================= */}

          <section
            className="
              rounded-2xl
              border
              border-gray-100
              bg-white
              overflow-hidden
              mb-4
            "
          >

            {/* DETAILS HEADER */}

            <button
              type="button"
              onClick={() =>
                setOpenDetails(
                  !openDetails
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3.5
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
                    text-[#4B49AC]
                    flex
                    items-center
                    justify-center
                  "
                >
                  {openDetails ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                <div className="text-left">

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Details
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Lead information
                  </p>

                </div>

              </div>


              <span
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                {filteredLeadFields.length}
              </span>

            </button>


            {/* DETAILS CONTENT */}

            <div
              className={`
                transition-all
                duration-300
                overflow-hidden
                ${
                  openDetails
                    ? "max-h-[900px] opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >

              <div
                className="
                  px-4
                  pb-4
                  pt-1
                  space-y-2
                "
              >

                {filteredLeadFields.length >
                0 ? (
                  filteredLeadFields.map(
                    (item) => {

                      if (
                        item.type ===
                        "link"
                      ) {
                        return (
                          <EditableLinkField
                            key={item.field}
                            label={item.label}
                            field={item.field}
                            value={item.value}
                            itemId={lead._id}
                            endpoint="leads"
                            onUpdate={
                              setLead
                            }
                          />
                        );
                      }

                      return (
                        <EditableField
                          key={item.field}
                          label={item.label}
                          field={item.field}
                          value={item.value}
                          itemId={lead._id}
                          endpoint="leads"
                          onUpdate={
                            setLead
                          }
                        />
                      );
                    }
                  )
                ) : (
                  <div
                    className="
                      py-6
                      text-center
                      text-xs
                      text-gray-400
                    "
                  >
                    No fields found
                  </div>
                )}

              </div>

            </div>

          </section>


          {/* =================================================
              ORGANIZATION SECTION
              
              PART 2 CONTINUES HERE
          ================================================= */}

          <section
            className="
              rounded-2xl
              border
              border-gray-100
              bg-white
              overflow-hidden
            "
          >

            <button
              type="button"
              onClick={() =>
                setOpenOrganization(
                  !openOrganization
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3.5
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
                    bg-violet-50
                    text-violet-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2 size={16} />
                </div>

                <div className="text-left">

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Organization
                  </h3>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                    "
                  >
                    Company information
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                {lead.organization && (
                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-emerald-500
                    "
                  />
                )}

                {openOrganization ? (
                  <ChevronUp
                    size={17}
                    className="text-gray-400"
                  />
                ) : (
                  <ChevronDown
                    size={17}
                    className="text-gray-400"
                  />
                )}

              </div>

            </button>


            {openOrganization && (
              <div className="px-4 pb-4">

                {/* -----------------------------------------
                    LINKED ORGANIZATION
                ------------------------------------------ */}

                {lead.organization ? (

                  <div>

                    {/* ORGANIZATION CARD */}

                    <div
                      className="
                        p-4
                        rounded-2xl
                        bg-gradient-to-br
                        from-indigo-50
                        via-white
                        to-violet-50
                        border
                        border-indigo-100
                        mb-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-gradient-to-br
                            from-indigo-500
                            to-violet-600
                            text-white
                            flex
                            items-center
                            justify-center
                            shadow-md
                            shadow-indigo-500/20
                            flex-shrink-0
                          "
                        >
                          <Building2
                            size={23}
                          />
                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <h4
                            className="
                              text-sm
                              font-bold
                              text-gray-800
                              truncate
                            "
                          >
                            {
                              lead.organization
                                ?.name
                            }
                          </h4>

                          <p
                            className="
                              text-xs
                              text-gray-400
                              mt-1
                              truncate
                            "
                          >
                            {
                              lead.organization
                                ?.industry ||
                              "No industry specified"
                            }
                          </p>

                        </div>

                      </div>


                      <div
                        className="
                          mt-4
                          pt-3
                          border-t
                          border-indigo-100
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <Link2
                          size={13}
                          className="
                            text-indigo-500
                          "
                        />

                        <span
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Linked Organization
                        </span>

                        <span
                          className="
                            ml-auto
                            flex
                            items-center
                            gap-1
                            text-[10px]
                            font-semibold
                            text-emerald-600
                            bg-emerald-50
                            px-2
                            py-1
                            rounded-full
                          "
                        >
                          <Check size={11} />
                          Linked
                        </span>

                      </div>

                    </div>


                    {/* -------------------------------------
                        BASIC ORGANIZATION FIELDS
                    -------------------------------------- */}

                    <div className="space-y-2">

                      <EditableField
                        label="Company Phone"
                        field="phone"
                        value={
                          lead.organization
                            ?.phone
                        }
                        itemId={
                          lead.organization
                            ?._id
                        }
                        endpoint="organizations"
                        onUpdate={
                          handleOrganizationUpdate
                        }
                      />

                      <EditableField
                        label="Company Email"
                        field="email"
                        value={
                          lead.organization
                            ?.email
                        }
                        itemId={
                          lead.organization
                            ?._id
                        }
                        endpoint="organizations"
                        onUpdate={
                          handleOrganizationUpdate
                        }
                      />

                      <EditableField
                        label="Address"
                        field="address.street"
                        value={
                          lead.organization
                            ?.address
                        }
                        itemId={
                          lead.organization
                            ?._id
                        }
                        endpoint="organizations"
                        onUpdate={
                          handleOrganizationUpdate
                        }
                      />

                      <EditableLinkField
                        label="Website"
                        field="website"
                        value={
                          lead.organization
                            ?.website
                        }
                        itemId={
                          lead.organization
                            ?._id
                        }
                        endpoint="organizations"
                        onUpdate={
                          handleOrganizationUpdate
                        }
                      />


                      {/* ---------------------------------
                          EXTRA ORGANIZATION FIELDS
                      ---------------------------------- */}

                      {organizationFields.map(
                        ({
                          label,
                          field,
                        }) => (
                          <EditableField
                            key={field}
                            label={label}
                            field={field}
                            value={
                              lead
                                .organization?.[
                                field
                              ]
                            }
                            itemId={
                              lead
                                .organization
                                ?._id
                            }
                            endpoint="organizations"
                            onUpdate={
                              handleOrganizationUpdate
                            }
                          />
                        )
                      )}

                    </div>


                    {/* ---------------------------------
                        UNLINK
                    ---------------------------------- */}

                    <button
                      type="button"
                      onClick={
                        handleUnlinkOrganization
                      }
                      className="
                        w-full
                        h-10
                        mt-4
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50
                        text-red-500
                        text-xs
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                        hover:bg-red-500
                        hover:text-white
                        hover:border-red-500
                        transition-all
                        duration-200
                      "
                    >
                      <Unlink size={15} />

                      Unlink Organization
                    </button>

                  </div>

                ) : (

                  /* ---------------------------------------
                     NO ORGANIZATION
                  ---------------------------------------- */

                  <div
                    className="
                      p-4
                      rounded-2xl
                      border
                      border-dashed
                      border-gray-300
                      bg-gray-50/70
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-gray-100
                          text-gray-400
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <Building2
                          size={20}
                        />
                      </div>


                      <div
                        className="
                          flex-1
                          min-w-0
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-700
                          "
                        >
                          No organization linked
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mt-0.5
                          "
                        >
                          Connect this lead to an organization
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() => {
                          setOrganizationSearch(
                            ""
                          );

                          setShowOrganizationModal(
                            true
                          );
                        }}
                        className="
                          w-9
                          h-9
                          rounded-xl
                          bg-[#4B49AC]
                          text-white
                          flex
                          items-center
                          justify-center
                          shadow-md
                          shadow-indigo-500/20
                          hover:bg-indigo-700
                          hover:scale-105
                          transition-all
                          duration-200
                          flex-shrink-0
                        "
                        title="Link organization"
                      >
                        <Plus size={18} />
                      </button>

                    </div>

                  </div>

                )}

              </div>
            )}

          </section>

        </aside>


        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <main
          className="
            flex-1
            min-w-0
            min-h-0
            overflow-y-auto
            bg-gray-50
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >

          <RightPanel
            type="lead"
            data={lead}
            setData={setLead}
          />

        </main>

      </div>


      {/* ==================================================
          ORGANIZATION MODAL
          
          
          ================================================== */}

       

{/* ==================================================
    LINK ORGANIZATION MODAL
================================================== */}

{showOrganizationModal && (
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
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setShowOrganizationModal(false);
        setOrganizationSearch("");
      }
    }}
  >

    {/* ==================================================
        MODAL
    ================================================== */}

    <div
      className="
        w-full
        max-w-[560px]
        bg-white
        rounded-3xl
        shadow-[0_25px_80px_rgba(15,23,42,0.25)]
        border
        border-gray-200
        overflow-hidden
        animate-[fadeIn_.2s_ease-out]
      "
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

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

        {/* LEFT */}

        <div className="flex items-center gap-3">

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-gradient-to-br
              from-indigo-50
              to-violet-50
              text-[#4B49AC]
              flex
              items-center
              justify-center
              border
              border-indigo-100
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
              Link Organization
            </h2>

            <p
              className="
                text-xs
                text-gray-400
                mt-0.5
              "
            >
              Connect this lead with an organization
            </p>

          </div>

        </div>


        {/* CLOSE */}

        <button
          type="button"
          onClick={() => {
            setShowOrganizationModal(false);
            setOrganizationSearch("");
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
            transition-all
            duration-200
          "
          title="Close"
        >
          <X size={19} />
        </button>

      </div>


      {/* ==================================================
          SEARCH AREA
      ================================================== */}

      <div className="px-6 pt-5">

        <div className="relative">

          {/* SEARCH ICON */}

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


          {/* SEARCH INPUT */}

          <input
            autoFocus
            type="text"
            placeholder="Search organizations..."
            value={organizationSearch}
            onChange={(event) =>
              setOrganizationSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setShowOrganizationModal(false);
                setOrganizationSearch("");
              }
            }}
            className="
              w-full
              h-12
              pl-11
              pr-11
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              text-sm
              text-gray-700
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              hover:border-indigo-300
              hover:bg-white
              focus:bg-white
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-500/10
            "
          />


          {/* CLEAR SEARCH */}

          {organizationSearch && (
            <button
              type="button"
              onClick={() =>
                setOrganizationSearch("")
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-7
                h-7
                rounded-lg
                flex
                items-center
                justify-center
                text-gray-400
                hover:bg-gray-200
                hover:text-gray-700
                transition
              "
            >
              <X size={15} />
            </button>
          )}

        </div>


        {/* SEARCH INFO */}

        <div
          className="
            flex
            items-center
            justify-between
            mt-3
          "
        >

          <div className="flex items-center gap-2">

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-indigo-500
              "
            />

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              {organizationLoading
                ? "Loading organizations..."
                : `${filteredOrganizations.length} organization${
                    filteredOrganizations.length !==
                    1
                      ? "s"
                      : ""
                  } found`}
            </p>

          </div>


          {organizationSearch && (
            <button
              type="button"
              onClick={() =>
                setOrganizationSearch("")
              }
              className="
                text-xs
                font-medium
                text-[#4B49AC]
                hover:text-indigo-700
                transition
              "
            >
              Clear search
            </button>
          )}

        </div>

      </div>


      {/* ==================================================
          ORGANIZATION LIST
      ================================================== */}

      <div className="px-6 py-4">

        <div
          className="
            max-h-[340px]
            overflow-y-auto
            pr-1
            space-y-2
            scrollbar-thin
            scrollbar-thumb-gray-200
            scrollbar-track-transparent
          "
        >

          {/* ==================================================
              LOADING
          ================================================== */}

          {organizationLoading ? (

            <div className="py-12">

              <div className="flex flex-col items-center">

                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    border-4
                    border-indigo-100
                    border-t-[#4B49AC]
                    animate-spin
                  "
                />

                <p
                  className="
                    mt-4
                    text-sm
                    font-medium
                    text-gray-600
                  "
                >
                  Loading organizations
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  Please wait...
                </p>

              </div>

            </div>

          ) : filteredOrganizations.length >
            0 ? (

            /* ==================================================
                RESULTS
            ================================================== */

            filteredOrganizations.map(
              (org) => (

                <button
                  type="button"
                  key={org._id}
                  disabled={linkingOrganization}
                  onClick={() =>
                    handleLinkOrganization(
                      org._id
                    )
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    border
                    border-transparent
                    hover:border-indigo-100
                    hover:bg-indigo-50/60
                    transition-all
                    duration-200
                    text-left
                    group
                    disabled:opacity-60
                    disabled:cursor-wait
                  "
                >

                  {/* ==================================================
                      ORGANIZATION ICON
                  ================================================== */}

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
                      group-hover:shadow-md
                      group-hover:scale-[1.03]
                      transition-all
                      duration-200
                    "
                  >
                    {linkingOrganization ? (
                      <div
                        className="
                          w-5
                          h-5
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                          animate-spin
                        "
                      />
                    ) : (
                      <Building2 size={21} />
                    )}
                  </div>


                  {/* ==================================================
                      ORGANIZATION INFO
                  ================================================== */}

                  <div
                    className="
                      flex-1
                      min-w-0
                    "
                  >

                    {/* NAME */}

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                        truncate
                        group-hover:text-[#4B49AC]
                        transition-colors
                        duration-200
                      "
                    >
                      {org.name ||
                        "Unnamed Organization"}
                    </p>


                    {/* METADATA */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-1.5
                        min-w-0
                      "
                    >

                      {/* INDUSTRY */}

                      {org.industry && (
                        <span
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-gray-400
                            truncate
                            max-w-[130px]
                          "
                          title={org.industry}
                        >
                          <BriefcaseBusiness
                            size={12}
                            className="
                              text-indigo-400
                              flex-shrink-0
                            "
                          />

                          <span className="truncate">
                            {org.industry}
                          </span>
                        </span>
                      )}


                      {/* WEBSITE */}

                      {org.website && (
                        <span
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-gray-400
                            truncate
                            max-w-[160px]
                          "
                          title={org.website}
                        >
                          <Globe
                            size={12}
                            className="
                              text-blue-400
                              flex-shrink-0
                            "
                          />

                          <span className="truncate">
                            {org.website
                              .replace(
                                /^https?:\/\//,
                                ""
                              )
                              .replace(
                                /\/$/,
                                ""
                              )}
                          </span>
                        </span>
                      )}

                    </div>

                  </div>


                  {/* ==================================================
                      ARROW
                  ================================================== */}

                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-gray-300
                      group-hover:bg-indigo-100
                      group-hover:text-[#4B49AC]
                      transition-all
                      duration-200
                      flex-shrink-0
                    "
                  >
                    <ChevronRight size={17} />
                  </div>

                </button>

              )
            )

          ) : (

            /* ==================================================
                EMPTY STATE
            ================================================== */

            <div className="py-10 text-center">

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
                <Building2 size={25} />
              </div>


              <h3
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                No organization found
              </h3>


              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                  max-w-[300px]
                  mx-auto
                  leading-relaxed
                "
              >
                {organizationSearch
                  ? `No organization matches "${organizationSearch}".`
                  : "There are no organizations available yet."}
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className="
          px-6
          py-4
          border-t
          border-gray-100
          bg-gray-50/70
        "
      >

        <div className="flex items-center gap-3">

          {/* CREATE NEW */}

          <button
            type="button"
            disabled={linkingOrganization}
            onClick={() => {
              setShowOrganizationModal(false);
              setOrganizationSearch("");
              setShowAddOrganizationModal(true);
            }}
            className="
              flex-1
              h-11
              rounded-xl
              border
              border-indigo-200
              bg-indigo-50
              text-[#4B49AC]
              font-semibold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#4B49AC]
              hover:border-[#4B49AC]
              hover:text-white
              transition-all
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Plus size={18} />

            Create New Organization
          </button>

        </div>

        <p
          className="
            text-[10px]
            text-gray-400
            text-center
            mt-3
          "
        >
          Select an organization to link it
          with this lead.
        </p>

      </div>

    </div>

  </div>
)}
    </div>
  );
}