import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiUsers,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiUser,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function Leads() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: null, // "single" | "bulk"
    id: null,
  });
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // FETCH LEADS
  // ==========================================

  const fetchLeads = async (userId = "") => {
    try {
      setLoading(true);

      const params = {};

      if (userId) {
        params.userId = userId;
      }

   
      const res = await api.get("/leads", {
        params,
      });

      
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };
  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();

      const userId = localStorage.getItem("userId");

      if (userId) {
        setSelectedUser(userId);
      }

      // Page load = ALL LEADS
      fetchLeads("");
    };

    loadData();
  }, []);

  // ==========================================
  // USER CHANGE
  // ==========================================

  const handleUserChange = (e) => {
    const userId = e.target.value;

 

    setSelectedUser(userId);

    fetchLeads(userId);
  };

  // ==========================================
  // SELECT LEAD
  // ==========================================

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  // ==========================================
  // SELECT ALL
  // ==========================================

  const toggleSelectAllLeads = () => {
    const visibleIds = filteredLeads.map((lead) => lead._id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedLeads.includes(id));

    if (allSelected) {
      setSelectedLeads((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedLeads((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  // ==========================================
  // DELETE MODE
  // ==========================================

 const openDeleteMode = () => {
  console.log("DELETE MODE CLICKED");
  setDeleteMode(true);
  setSelectedLeads([]);
};

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedLeads([]);
  };

  // ==========================================
  // SINGLE DELETE
  // ==========================================

  const confirmSingleLeadDelete = (leadId) => {
    setDeleteModal({
      open: true,
      type: "single",
      id: leadId,
    });
  };

  // ==========================================
  // BULK DELETE
  // ==========================================

  const confirmBulkLeadDelete = () => {
    if (!selectedLeads.length) return;

    setDeleteModal({
      open: true,
      type: "bulk",
      id: null,
    });
  };
  // ==========================================
  // DELETE LEADS
  // ==========================================

  const handleDeleteLeads = async () => {
    try {
      setDeleting(true);

      // -----------------------------
      // SINGLE DELETE
      // -----------------------------

      if (deleteModal.type === "single" && deleteModal.id) {
        await api.delete(`/leads/${deleteModal.id}`);

        setLeads((prev) => prev.filter((lead) => lead._id !== deleteModal.id));
      }

      // -----------------------------
      // BULK DELETE
      // -----------------------------

      if (deleteModal.type === "bulk") {
        await api.delete("/leads/bulk-delete", {
          data: {
            ids: selectedLeads,
          },
        });

        setLeads((prev) =>
          prev.filter((lead) => !selectedLeads.includes(lead._id)),
        );

        setSelectedLeads([]);
        setDeleteMode(false);
      }

      setDeleteModal({
        open: false,
        type: null,
        id: null,
      });
    } catch (error) {
      console.error("DELETE LEAD ERROR:", error);

      alert(error.response?.data?.message || "Failed to delete lead.");
    } finally {
      setDeleting(false);
    }
  };
  // ==========================================
  // FILTER
  // ==========================================

  const filteredLeads = leads.filter((lead) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    const name = lead.name?.toLowerCase() || "";

    const organization = lead.organization?.name?.toLowerCase() || "";

    const email = lead.email?.[0]?.address?.toLowerCase() || "";

    const phone = String(lead.phone?.[0]?.number || "").toLowerCase();

    const title = lead.title?.toLowerCase() || "";

    const website = lead.website?.toLowerCase() || "";

    const instagram = lead.instagram?.toLowerCase() || "";

    const facebook = lead.facebook?.toLowerCase() || "";

    return (
      name.includes(text) ||
      organization.includes(text) ||
      email.includes(text) ||
      phone.includes(text) ||
      title.includes(text) ||
      website.includes(text) ||
      instagram.includes(text) ||
      facebook.includes(text)
    );
  });

  // ==========================================
  // AVATAR LETTER
  // ==========================================

  const getInitial = (name) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="w-full">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-25">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-indigo-50
                text-[#4B49AC]
                flex
                items-center
                justify-center
              "
            >
              <FiUsers size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">People</h1>

              <p className="text-sm text-black mt-0.5">
                Manage and view all your leads
              </p>
            </div>
          </div>

          {/* COUNT */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className="
                px-2.5
                py-1
                rounded-full
                bg-indigo-50
                text-[#4B49AC]
                text-xs
                font-semibold
              "
            >
              {filteredLeads.length} Leads
            </span>

            {search && (
              <span className="text-xs text-black">matching "{search}"</span>
            )}
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* USER FILTER */}
          {/* <select
            value={selectedUser}
            onChange={handleUserChange}
            className="
    h-11
    min-w-[180px]
    appearance-none
    border
    border-gray-200
    bg-white
    pl-10
    pr-9
    rounded-xl
    text-sm
    text-gray-700
    outline-none
    cursor-pointer
    transition-all
    duration-200
    hover:border-indigo-300
    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-500/10
    shadow-sm
  "
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select> */}

          {/* SEARCH */}
          <div className="relative">
            <FiSearch
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-black
                pointer-events-none
              "
            />

            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-11
                w-full
                sm:w-[250px]
                border
                border-gray-200
                bg-white
                pl-10
                pr-4
                rounded-xl
                text-sm
                text-gray-700
                placeholder:text-black
                outline-none
                transition-all
                duration-200
                hover:border-indigo-300
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
                shadow-sm
              "
            />
          </div>
        </div>
      </div>

      {/* ======================================
          TABLE CARD
      ======================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          overflow-hidden
        "
      >
        {/* TABLE TOP BAR */}

        <div
          className="
    px-5
    py-4
    border-b
    border-gray-100
    flex
    flex-col
    sm:flex-row
    sm:items-center
    justify-between
    gap-3
  "
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Lead Directory
            </h2>
{deleteMode && (
  <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
    DELETE MODE ACTIVE
  </div>
)}
            <p className="text-xs text-black mt-0.5">
              {deleteMode
                ? "Select leads you want to delete"
                : "Click any lead to view details"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {deleteMode ? (
              <>
                {selectedLeads.length > 0 && (
                  <button
                    type="button"
                    onClick={confirmBulkLeadDelete}
                    className="
              h-10
              px-4
              rounded-xl
              bg-red-600
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              hover:bg-red-700
              transition
            "
                  >
                    <FiTrash2 size={16} />
                    Delete Selected ({selectedLeads.length})
                  </button>
                )}

                <button
                  type="button"
                  onClick={cancelDeleteMode}
                  className="
            h-10
            px-4
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-600
            text-sm
            font-semibold
            hover:bg-gray-50
            transition
          "
                >
                  Cancel
                </button>
              </>
            ) : (
         <button
  type="button"
  onClick={openDeleteMode}
  className="
    h-10
    px-4
    rounded-xl
    border
    border-red-200
    bg-red-50
    text-red-600
    text-sm
    font-semibold
    flex
    items-center
    gap-2
    hover:bg-red-100
    transition
  "
>
  <FiTrash2 size={16} />
  Delete
</button>
            )}
          </div>
        </div>
       
        {/* ======================================
            TABLE
        ======================================= */}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEAD */}

   <thead>
  <tr
    className="
      bg-gray-50/70
      border-b
      border-gray-100
    "
  >
    {deleteMode && (
      <th className="w-12 px-5 py-3.5">
        <input
          type="checkbox"
          checked={
            filteredLeads.length > 0 &&
            filteredLeads.every((lead) =>
              selectedLeads.includes(lead._id)
            )
          }
          onChange={toggleSelectAllLeads}
          className="w-4 h-4 accent-red-600 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </th>
    )}

    <th className="text-left px-5 py-3.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-black">
        Name
      </span>
    </th>

    <th className="text-left px-5 py-3.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-black">
        Organization
      </span>
    </th>

    <th className="text-left px-5 py-3.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-black">
        Email
      </span>
    </th>

    <th className="text-left px-5 py-3.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-black">
        Phone
      </span>
    </th>

    <th className="text-left px-5 py-3.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-black">
        Owner
      </span>
    </th>

    <th className="w-12" />
  </tr>
</thead>

            {/* BODY */}

            <tbody>
              {loading ? (
                /* LOADING */

                <tr>
                  <td colSpan="6" className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="
                          w-8
                          h-8
                          border-2
                          border-indigo-500
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />

                      <p className="mt-3 text-sm text-black">
                        Loading leads...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => {
                      if (!deleteMode) {
                        navigate(`/app/leads/${lead._id}`);
                      }
                    }}
                    className="
                      group
                      border-b
                      border-gray-100
                      last:border-b-0
                      hover:bg-indigo-50/40
                      cursor-pointer
                      transition-all
                      duration-200
                    "
                  >
                    {deleteMode && (
  <td
    className="px-4 py-4"
    onClick={(e) => e.stopPropagation()}
  >
    <input
      type="checkbox"
      checked={selectedLeads.includes(lead._id)}
      onChange={() =>
        toggleLeadSelection(lead._id)
      }
      className="
        w-4
        h-4
        accent-red-600
        cursor-pointer
      "
    />
  </td>
)}
                    {/* NAME */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <p
                            className="
                              font-semibold
                              text-gray-800
                              truncate
                              group-hover:text-[#4B49AC]
                              transition-colors
                            "
                          >
                            {lead.name || "Unnamed Lead"}
                          </p>

                          {lead.title && (
                            <p className="text-xs text-black truncate mt-0.5">
                              {lead.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ORGANIZATION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-lg
                            
                            text-black
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          "
                        >
                          <HiOutlineBuildingOffice2 size={20} />
                        </div>

                        <span
                          className="
                            text-gray-600
                            truncate
                            max-w-[180px]
                          "
                        >
                          {lead.organization?.name || "—"}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4">
                      {lead.email?.[0]?.address ? (
                        <div className="flex items-center gap-2">
                          <FiMail
                            size={15}
                            className="text-black flex-shrink-0"
                          />

                          <span
                            className="
                              text-gray-600
                              truncate
                              max-w-[220px]
                            "
                          >
                            {lead.email[0].address}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-4">
                      {lead.phone?.[0]?.number ? (
                        <div className="flex items-center gap-2">
                          <FiPhone size={15} className="text-black" />

                          <span className="text-gray-600">
                            {lead.phone[0].number}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* OWNER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            text-xs
                            font-semibold
                          "
                        >
                          {getInitial(lead.owner?.name)}
                        </div>

                        <span className="text-gray-600">
                          {lead.owner?.name || "—"}
                        </span>
                      </div>
                    </td>

                    {/* ARROW */}

               <td className="px-4">
  {deleteMode ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        confirmSingleLeadDelete(lead._id);
      }}
      className="
        w-9
        h-9
        rounded-lg
        flex
        items-center
        justify-center
        text-red-500
        hover:bg-red-50
        hover:text-red-600
        transition
      "
      title="Delete lead"
    >
      <FiTrash2 size={17} />
    </button>
  ) : (
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
      "
    >
      <FiChevronRight size={18} />
    </div>
  )}
</td>
                  </tr>
                ))
              ) : (
                /* EMPTY STATE */

                <tr>
                  <td colSpan="6" className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-gray-100
                          text-black
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FiUsers size={25} />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-gray-700">
                        No leads found
                      </h3>

                      <p className="mt-1 text-xs text-black">
                        {search
                          ? "Try changing your search keyword."
                          : "There are no leads available for this user."}
                      </p>

                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="
                            mt-4
                            px-4
                            py-2
                            rounded-lg
                            bg-indigo-50
                            text-[#4B49AC]
                            text-xs
                            font-semibold
                            hover:bg-indigo-100
                            transition
                          "
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deleteModal.open && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">

      <div className="flex items-start gap-4">

        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
          <FiTrash2 size={20} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Are you sure?
          </h3>

          <p className="mt-1 text-sm text-gray-500 leading-6">
            {deleteModal.type === "bulk"
              ? `You are about to delete ${selectedLeads.length} selected leads. This action cannot be undone.`
              : "You are about to delete this lead. This action cannot be undone."}
          </p>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-7">

        <button
          type="button"
          disabled={deleting}
          onClick={() =>
            setDeleteModal({
              open: false,
              type: null,
              id: null,
            })
          }
          className="
            h-10 px-5 rounded-xl
            border border-gray-200
            text-gray-600 text-sm font-semibold
            hover:bg-gray-50
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={handleDeleteLeads}
          className="
            h-10 px-5 rounded-xl
            bg-red-600 text-white
            text-sm font-semibold
            flex items-center gap-2
            hover:bg-red-700
            disabled:opacity-60
          "
        >
          {deleting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <FiTrash2 size={15} />
              Delete
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
