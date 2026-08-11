import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Organizations() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrganizations = async (userId = "") => {
  try {
    const params = {};

    if (userId) {
      params.userId = userId;
    }

    const res = await api.get("/organizations", {
      params,
    });

    setOrganizations(
      Array.isArray(res.data) ? res.data : []
    );
  } catch (err) {
    console.error(
      "Fetch organizations error:",
      err
    );
  }
};

 useEffect(() => {
  fetchUsers();

  const userId =
    localStorage.getItem("userId");

  if (userId) {
    setSelectedUser(userId);
    fetchOrganizations(userId);
  } else {
    fetchOrganizations("");
  }
}, []);

 const handleUserChange = (e) => {
  const userId = e.target.value;

  setSelectedUser(userId);

  fetchOrganizations(userId);
};
 const filteredOrganizations = organizations.filter((org) => {
  const text = search.trim().toLowerCase();

  if (!text) return true;

  const name =
    org.name?.toLowerCase() || "";

  const website =
    org.website?.toLowerCase() || "";

  const email =
    org.email?.toLowerCase() || "";

  const phone =
    String(org.phone ?? "").toLowerCase();

  const industry =
    org.industry?.toLowerCase() || "";

  return (
    name.includes(text) ||
    website.includes(text) ||
    email.includes(text) ||
    phone.includes(text) ||
    industry.includes(text)
  );
});

  return (
    <div className="p-6 bg-gradient-to-br from-[#f5f7fb] to-[#eef2f7] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
          Organizations
        </h1>

        <div className="flex gap-3">

          {/* USER DROPDOWN */}
        <select
  value={selectedUser}
  onChange={handleUserChange}
  className="
    border
    border-gray-300
    px-3
    py-2
    rounded-xl
    text-sm
    bg-white
    outline-none
    cursor-pointer
    focus:ring-2
    focus:ring-blue-500
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

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition w-[240px]"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Organization</th>
              <th className="text-left px-5 py-3">Website</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Industry</th>
              <th className="text-left px-5 py-3">People</th>
              <th className="text-left px-5 py-3">Owner</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((org) => (
                <tr
                  key={org._id}
                  onClick={() => navigate(`/app/organizations/${org._id}`)}
                  className="group hover:bg-blue-50 cursor-pointer transition-all duration-200 border-t"
                >

                  {/* NAME */}
                  <td className="px-5 py-4 font-medium text-gray-800 group-hover:text-blue-600 transition">
                    {org.name}
                  </td>

                  {/* WEBSITE */}
                  <td className="px-5 py-4 text-blue-600 truncate max-w-[180px]">
                    {org.website || "—"}
                  </td>

                  {/* EMAIL */}
                  <td className="px-5 py-4 text-gray-700 truncate max-w-[180px]">
                    {org.email || "—"}
                  </td>

                  {/* PHONE */}
                  <td className="px-5 py-4 text-gray-700">
                    {org.phone || "—"}
                  </td>

                  {/* INDUSTRY */}
                  <td className="px-5 py-4 text-gray-700">
                    {org.industry || "—"}
                  </td>

                  {/* PEOPLE */}
                  <td className="px-5 py-4 text-gray-700">
                    {org.leads?.length || 0}
                  </td>

                  {/* OWNER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                        {org.owner?.name?.charAt(0) || "U"}
                      </div>

                      <span className="text-gray-700">
                        {org.owner?.name || "—"}
                      </span>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-400"
                >
                  No organizations found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}