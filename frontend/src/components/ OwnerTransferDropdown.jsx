import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import { User, ChevronDown, Check, Search } from "lucide-react";

export default function OwnerTransferDropdown({
  owner,
  entityId,
  entityType,
  onSuccess,
}) {
    
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name
        ?.toLowerCase()
        .includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

  const handleTransfer = async (ownerId) => {
    try {
      const res = await api.put(
        `/${entityType}/${entityId}/transfer`,
        {
          ownerId,
        }
      );

      onSuccess(res.data);

      setShowDropdown(false);

      setSearchUser("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
 
<div className="relative" ref={dropdownRef}>
  {/* Button */}
  <div
    onClick={() => setShowDropdown(!showDropdown)}
    className="group flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 transition-all duration-300  "
  >
    <div className="w-11 h-11 rounded-full bg-[#4B49AC] flex items-center justify-center shadow">
      <User
        size={20}
        className="text-white"
      />
    </div>

    <div className="flex-1 leading-tight">
      <p className="font-semibold text-gray-800">
        {owner?.name}
      </p>

      <p className="text-xs text-gray-500">
        Lead Owner
      </p>
    </div>

    <ChevronDown
      size={18}
      className={`text-gray-500 transition-all duration-300 ${
        showDropdown ? "rotate-180" : ""
      }`}
    />
  </div>

  {/* Dropdown */}
  <div
    className={`absolute right-0 mt-3 w-[280px] origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50 transition-all duration-200 ${
      showDropdown
        ? "opacity-100 scale-100 translate-y-0 visible"
        : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
    }`}
  >
    {/* Header */}
    <div className="bg-[#4B49AC] px-4 py-3 text-white">
      <p className="text-sm font-medium">
        Transfer Ownership
      </p>

      <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/15 backdrop-blur p-2.5">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <User
            size={18}
            className="text-blue-600"
          />
        </div>

        <div>
          <p className="font-semibold">
            {owner?.name}
          </p>

          <p className="text-xs opacity-90">
            Current Owner
          </p>
        </div>
      </div>
    </div>

    {/* Search */}
    <div className="p-3 ">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search people..."
          value={searchUser}
          onChange={(e) =>
            setSearchUser(e.target.value)
          }
          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>

    {/* Users */}
    <div className="max-h-44 overflow-y-auto custom-scroll">
      {filteredUsers.map((user) => {
        const selected =
          owner?._id === user._id;

        return (
          <div
            key={user._id}
            onClick={() =>
              handleTransfer(user._id)
            }
            className={`mx-2 my-1 flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 ${
              selected
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-blue-50   hover:border-blue-200"
            }`}
          >
            <div>
              <p className="font-medium text-sm text-gray-800">
                {user.name}
              </p>

              <p className="text-xs text-gray-500">
                Team Member
              </p>
            </div>

            {selected && (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Check
                  size={13}
                  className="text-white"
                />
              </div>
            )}
          </div>
        );
      })}

      {filteredUsers.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400">
          No users found
        </div>
      )}
    </div>
  </div>
</div>
  );
}