import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  Search,
  Users,
  Globe2,
  Mail,
  Phone,
  BriefcaseBusiness,
  ChevronRight,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function Organizations() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // FETCH USERS
  // ==========================

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  // ==========================
  // FETCH ORGANIZATIONS
  // ==========================

  const fetchOrganizations = async (userId = "") => {
    try {
      setLoading(true);

      const params = {};

      if (userId) {
        params.userId = userId;
      }

      const res = await api.get("/organizations", {
        params,
      });

      setOrganizations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch organizations error:", err);

      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {
    fetchUsers();

    const userId = localStorage.getItem("userId");

    if (userId) {
      setSelectedUser(userId);
      fetchOrganizations(userId);
    } else {
      fetchOrganizations("");
    }
  }, []);

  // ==========================
  // USER FILTER
  // ==========================

  const handleUserChange = (e) => {
    const userId = e.target.value;

    setSelectedUser(userId);

    fetchOrganizations(userId);
  };

  // ==========================
  // SEARCH
  // ==========================

  const filteredOrganizations = organizations.filter((org) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    const name = org.name?.toLowerCase() || "";

    const website = org.website?.toLowerCase() || "";

    const email = org.email?.toLowerCase() || "";

    const phone = String(org.phone ?? "").toLowerCase();

    const industry = org.industry?.toLowerCase() || "";

    return (
      name.includes(text) ||
      website.includes(text) ||
      email.includes(text) ||
      phone.includes(text) ||
      industry.includes(text)
    );
  });

  // ==========================
  // AVATAR
  // ==========================

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "O";
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f8fc]
        p-5
        md:p-6
      "
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-5
          mb-6
        "
      >
        {/* TITLE */}

        <div className="flex items-center gap-3">
          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-indigo-50
              text-indigo-600
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <HiOutlineBuildingOffice2 size={30} />
          </div>

          <div>
            <h1
              className="
                text-xl
                md:text-2xl
                font-bold
                text-gray-800
              "
            >
              Organizations
            </h1>

            <p
              className="
                text-sm
                md:text-sm
                text-gray-400
                mt-0.5
              "
            >
              Manage companies and organization records
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
            w-full
            xl:w-auto
          "
        >
          {/* USER FILTER */}

          <div className="relative">
            <Users
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="
                h-11
                w-full
                sm:w-[170px]
                pl-9
                pr-8
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                appearance-none
                cursor-pointer
                transition
                hover:border-indigo-200
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
            >
              <option value="">All Users</option>

              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH */}

          <div className="relative">
            <Search
              size={17}
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
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-11
                w-full
                sm:w-[280px]
                pl-10
                pr-4
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                hover:border-indigo-200
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
            />
          </div>
        </div>
      </div>

      {/* =====================================
          STATS
      ====================================== */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-3
          gap-3
          mb-5
        "
      >
        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Organizations</p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                {organizations.length}
              </p>
            </div>

            <div
              className="
                w-9
                h-9
                
             
                flex
                items-center
                justify-center
              "
            >
              <HiOutlineBuildingOffice2 size={30} />
            </div>
          </div>
        </div>

        {/* <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Showing</p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                {filteredOrganizations.length}
              </p>
            </div>

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <SlidersHorizontal size={17} />
            </div>
          </div>
        </div> */}

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total People</p>

              <p className="text-xl font-bold text-gray-800 mt-1">
                {organizations.reduce(
                  (total, org) => total + (org.leads?.length || 0),
                  0,
                )}
              </p>
            </div>

            <div
              className="
                w-9
                h-9
               
                flex
                items-center
                justify-center
              "
            >
              <Users size={30} />
            </div>
          </div>
        </div>

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-4
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Selected Owner</p>

              <p className="text-sm font-bold text-gray-800 mt-1 truncate max-w-[120px]">
                {selectedUser
                  ? users.find((u) => u._id === selectedUser)?.name ||
                    "Selected"
                  : "All Users"}
              </p>
            </div>

            <div
              className="
                w-9
                h-9
               
                flex
                items-center
                justify-center
              "
            >
              <UserRound size={30} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          TABLE
      ====================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          overflow-hidden
        "
      >
        {/* TABLE HEADER */}

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
            <h2
              className="
                text-sm
                font-bold
                text-gray-800
              "
            >
              Organization List
            </h2>

            <p
              className="
                text-sm
                text-gray-400
                mt-0.5
              "
            >
              {filteredOrganizations.length} organization
              {filteredOrganizations.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr
                className="
                  bg-gray-50/80
                  border-b
                  border-gray-100
                "
              >
                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Organization
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Website
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Email
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Phone
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Industry
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  People
                </th>

                <th
                  className="
                    text-left
                    px-5
                    py-3.5
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Owner
                </th>

                <th className="w-10" />
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                      <td key={cell} className="px-5 py-4">
                        <div
                          className="
                              h-4
                              bg-gray-100
                              rounded
                              animate-pulse
                              w-24
                            "
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org) => (
                  <tr
                    key={org._id}
                    onClick={() => navigate(`/app/organizations/${org._id}`)}
                    className="
                        group
                        border-b
                        border-gray-100
                        last:border-0
                        cursor-pointer
                        transition-all
                        duration-200
                        hover:bg-indigo-50/40
                      "
                  >
                    {/* ORGANIZATION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
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
                          <HiOutlineBuildingOffice2 size={25} />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                                text-sm
                                font-semibold
                                text-gray-800
                                truncate
                                max-w-[200px]
                                group-hover:text-indigo-600
                                transition
                              "
                          >
                            {org.name || "Unnamed Organization"}
                          </p>

                          <p
                            className="
                                text-[11px]
                                text-gray-400
                                mt-0.5
                              "
                          >
                            Organization
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* WEBSITE */}

                    <td className="px-5 py-4">
                      {org.website ? (
                        <div
                          className="
                              flex
                              items-center
                              gap-2
                              
                            "
                        >
                          <Globe2 size={25} className="flex-shrink-0" />

                          <span
                            className="
                            text-indigo-600
                                text-sm
                                truncate
                                max-w-[180px]
                              "
                          >
                            {org.website}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4">
                      {org.email ? (
                        <div
                          className="
                              flex
                              items-center
                              gap-2
                            "
                        >
                          <Mail
                            size={14}
                            className="
                                text-gray-400
                                flex-shrink-0
                              "
                          />

                          <span
                            className="
                                text-
                                text-gray-600
                                truncate
                                max-w-[200px]
                              "
                          >
                            {org.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-4">
                      {org.phone ? (
                        <div
                          className="
                              flex
                              truncate
                              items-center
                              gap-2
                            "
                        >
                          <Phone size={25}  />

                          <span
                            className="
                                text-sm
                                text-gray-600
                              "
                          >
                            {org.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* INDUSTRY */}

                    <td className="px-5 py-4">
                      {org.industry ? (
                        <span
                          className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-2.5
                              py-1
                              rounded-lg
                              bg-gray-100
                              text-gray-600
                              text-[11px]
                              font-medium
                            "
                        >
                          <BriefcaseBusiness size={12} />

                          {org.industry}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* PEOPLE */}

                    <td className="px-5 py-4">
                      <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-2.5
                            py-1.5
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                          "
                      >
                        <Users size={15} />

                        <span
                          className="
                              text-sm
                              font-semibold
                            "
                        >
                          {org.leads?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* OWNER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                              w-8
                              h-8
                              rounded-full
                              bg-indigo-100
                              text-indigo-600
                              flex
                              items-center
                              justify-center
                              text-sm
                              font-bold
                              flex-shrink-0
                            "
                        >
                          {getInitial(org.owner?.name)}
                        </div>

                        <span
                          className="
                              text-sm
                              font-medium
                              text-gray-600
                              truncate
                              max-w-[120px]
                            "
                        >
                          {org.owner?.name || "—"}
                        </span>
                      </div>
                    </td>

                    {/* ARROW */}

                    <td className="px-3 py-4">
                      <ChevronRight
                        size={17}
                        className="
                            text-gray-300
                            group-hover:text-indigo-500
                            group-hover:translate-x-0.5
                            transition-all
                          "
                      />
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY */

                <tr>
                  <td
                    colSpan="8"
                    className="
                      py-16
                      text-center
                    "
                  >
                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-gray-50
                        border
                        border-gray-100
                        text-gray-300
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <HiOutlineBuildingOffice2 size={25} />
                    </div>

                    <h3
                      className="
                        mt-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      No organizations found
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-400
                      "
                    >
                      Try changing your search or user filter.
                    </p>
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
