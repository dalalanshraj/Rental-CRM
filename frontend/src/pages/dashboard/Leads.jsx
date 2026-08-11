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
} from "react-icons/fi";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function Leads() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchLeads = async (userId) => {
    try {
      setLoading(true);

      const url = userId
        ? `/leads?userId=${userId}`
        : "/leads";

      const res = await api.get(url);

      setLeads(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.log(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchUsers();

    const userId =
      localStorage.getItem("userId");

    if (userId) {
      setSelectedUser(userId);
      fetchLeads(userId);
    } else {
      fetchLeads("");
    }
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
  // FILTER
  // ==========================================

  const filteredLeads = leads.filter((lead) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    const name =
      lead.name?.toLowerCase() || "";

    const organization =
      lead.organization?.name?.toLowerCase() || "";

    const email =
      lead.email?.[0]?.address?.toLowerCase() || "";

    const phone =
      String(
        lead.phone?.[0]?.number || ""
      ).toLowerCase();

    const title =
      lead.title?.toLowerCase() || "";

    const website =
      lead.website?.toLowerCase() || "";

    const instagram =
      lead.instagram?.toLowerCase() || "";

    const facebook =
      lead.facebook?.toLowerCase() || "";

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

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="w-full">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

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
              <h1 className="text-2xl font-bold text-gray-800">
                People
              </h1>

              <p className="text-sm text-gray-400 mt-0.5">
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
              <span className="text-xs text-gray-400">
                matching "{search}"
              </span>
            )}

          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* USER FILTER */}
          <div className="relative">

            <FiUser
              size={17}
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
              value={selectedUser || ""}
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
              <option value="">
                All Users
              </option>

              {users.map((u) => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name}
                </option>
              ))}
            </select>

            {/* CUSTOM ARROW */}
            <span
              className="
                absolute
                right-3
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

          {/* SEARCH */}
          <div className="relative">

            <FiSearch
              size={18}
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
              placeholder="Search leads..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
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
                placeholder:text-gray-400
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
            items-center
            justify-between
          "
        >

          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Lead Directory
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Click any lead to view details
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-400
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-500
              "
            />

            {filteredLeads.length} results
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

                <th className="text-left px-5 py-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Name
                  </span>
                </th>

                <th className="text-left px-5 py-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Organization
                  </span>
                </th>

                <th className="text-left px-5 py-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </span>
                </th>

                <th className="text-left px-5 py-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Phone
                  </span>
                </th>

                <th className="text-left px-5 py-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
                  <td
                    colSpan="6"
                    className="py-16"
                  >
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

                      <p className="mt-3 text-sm text-gray-400">
                        Loading leads...
                      </p>

                    </div>
                  </td>
                </tr>

              ) : filteredLeads.length > 0 ? (

                filteredLeads.map((lead) => (

                  <tr
                    key={lead._id}
                    onClick={() =>
                      navigate(
                        `/app/leads/${lead._id}`
                      )
                    }
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
                            <p className="text-xs text-gray-400 truncate mt-0.5">
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
                          <HiOutlineBuildingOffice2
                            size={20}
                          />
                        </div>

                        <span
                          className="
                            text-gray-600
                            truncate
                            max-w-[180px]
                          "
                        >
                          {lead.organization?.name ||
                            "—"}
                        </span>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4">

                      {lead.email?.[0]?.address ? (
                        <div className="flex items-center gap-2">

                          <FiMail
                            size={15}
                            className="text-gray-400 flex-shrink-0"
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
                        <span className="text-gray-300">
                          —
                        </span>
                      )}

                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-4">

                      {lead.phone?.[0]?.number ? (
                        <div className="flex items-center gap-2">

                          <FiPhone
                            size={15}
                            className="text-gray-400"
                          />

                          <span className="text-gray-600">
                            {lead.phone[0].number}
                          </span>

                        </div>
                      ) : (
                        <span className="text-gray-300">
                          —
                        </span>
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
                          {getInitial(
                            lead.owner?.name
                          )}
                        </div>

                        <span className="text-gray-600">
                          {lead.owner?.name || "—"}
                        </span>

                      </div>

                    </td>

                    {/* ARROW */}

                    <td className="px-4">

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

                    </td>

                  </tr>

                ))

              ) : (

                /* EMPTY STATE */

                <tr>
                  <td
                    colSpan="6"
                    className="py-16"
                  >

                    <div className="flex flex-col items-center justify-center">

                      <div
                        className="
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
                        <FiUsers size={25} />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-gray-700">
                        No leads found
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {search
                          ? "Try changing your search keyword."
                          : "There are no leads available for this user."}
                      </p>

                      {search && (
                        <button
                          type="button"
                          onClick={() =>
                            setSearch("")
                          }
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

    </div>
  );
}