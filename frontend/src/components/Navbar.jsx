import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BiTargetLock } from "react-icons/bi";
import { AiOutlineDollar } from "react-icons/ai";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar({
  onSearch,
  searchResults = [],
  onAddLead,
  onAddDeal,
  onAddOrganization,
}) {
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";

  // ==========================================
  // SEARCH / DEBOUNCE
  // ==========================================

  useEffect(() => {
    const value = query.trim();

    if (!value) {
      onSearch("");
      setSearching(false);
      return;
    }

    setSearching(true);

    const timer = setTimeout(async () => {
      await onSearch(value);
      setSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  // ==========================================
  // CLOSE PLUS MENU ON OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  // ==========================================
  // OPEN RESULT
  // ==========================================

  const handleResultClick = (item) => {
    clearSearch();

    if (item.type === "lead") {
      navigate(`/app/leads/${item._id}`);
      return;
    }

    if (item.type === "deal") {
      navigate(`/app/deals/${item._id}`);
      return;
    }

    if (item.type === "organization") {
      navigate(`/app/organizations/${item._id}`);
      return;
    }
  };

  // ==========================================
  // RESULT NAME
  // ==========================================

  const getResultName = (item) => {
    if (item.type === "organization") {
      return item.name || "Unnamed Organization";
    }

    if (item.type === "lead") {
      return item.name || "Unnamed Lead";
    }

    if (item.type === "deal") {
      return item.title || item.name || "Unnamed Deal";
    }

    return "Unknown";
  };

  // ==========================================
  // RESULT TYPE
  // ==========================================

  const getResultType = (type) => {
    switch (type) {
      case "lead":
        return "Lead";

      case "deal":
        return "Deal";

      case "organization":
        return "Organization";

      default:
        return "";
    }
  };

  const userPhoto = localStorage.getItem("userPhoto") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");

    navigate("/");
  };

  return (
    <div
      className="
        relative
        h-[74px]
        w-full
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        px-6
        shadow-[0_1px_8px_rgba(0,0,0,0.03)]
      "
    >
      {/* =====================================
          LEFT / SEARCH AREA
      ====================================== */}

      <div
        ref={searchRef}
        className="
          flex
          items-center
          gap-3
          w-full
          justify-center
        "
      >
        {/* SEARCH */}
        <div className="relative w-full max-w-[560px] group">
          <FiSearch
            size={19}
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
            type="text"
            placeholder="Search  "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full
              h-[46px]
              border
              border-gray-200
              bg-gray-50
              px-11
              pr-12
              rounded-xl
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
          <span
            className="
    absolute
    left-1/2
    -translate-x-1/2
    top-15
    px-3
    py-2
    rounded-lg
    bg-slate-900
    border
    border-slate-700
    text-white
    text-xs
    font-medium
    whitespace-nowrap
    opacity-0
    invisible
    translate-y-1
    group-hover:opacity-100
    group-hover:visible
    group-hover:translate-y-0
    transition-all
    duration-200
    shadow-xl
    z-[500]
    pointer-events-none
  "
          >
            Search
          </span>
          {/* SEARCH LOADER */}
          {searching && (
            <div
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                border-2
                border-indigo-500
                border-t-transparent
                rounded-full
                animate-spin
              "
            />
          )}

          {/* =====================================
              SEARCH RESULTS
          ====================================== */}

          {query.trim() && (
            <div
              className="
                absolute
                left-0
                right-0
                top-[54px]
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-[0_15px_45px_rgba(15,23,42,0.14)]
                overflow-hidden
                z-[300]
              "
            >
              {/* SEARCHING */}
              {searching && (
                <div className="px-5 py-5 flex items-center gap-3">
                  <div
                    className="
                      w-5
                      h-5
                      border-2
                      border-indigo-500
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />

                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              )}

              {/* RESULTS */}
              {!searching && searchResults.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      type="button"
                      key={`${item.type}-${item._id}`}
                      onClick={() => handleResultClick(item)}
                      className="
                          w-full
                          text-left
                          px-5
                          py-3.5
                          border-b
                          border-gray-100
                          last:border-b-0
                          hover:bg-indigo-50/60
                          transition-all
                          duration-200
                          flex
                          items-center
                          justify-between
                          gap-4
                          group
                        "
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* ICON */}
                        <div
                          className={`
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                item.type === "lead"
                                  ? "bg-blue-100 text-blue-600"
                                  : item.type === "deal"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-violet-100 text-violet-600"
                              }
                            `}
                        >
                          {item.type === "lead" && <BiTargetLock size={19} />}

                          {item.type === "deal" && (
                            <AiOutlineDollar size={19} />
                          )}

                          {item.type === "organization" && (
                            <HiOutlineBuildingOffice2 size={19} />
                          )}
                        </div>

                        {/* NAME */}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {getResultName(item)}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            {getResultType(item.type)}
                          </p>
                        </div>
                      </div>

                      <HiOutlineChevronRight
                        size={18}
                        className="
                            text-gray-300
                            group-hover:text-indigo-500
                            transition
                            flex-shrink-0
                          "
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* NO RESULTS */}
              {!searching && searchResults.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <div
                    className="
                        mx-auto
                        w-10
                        h-10
                        rounded-full
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        mb-3
                      "
                  >
                    <FiSearch size={18} className="text-gray-400" />
                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    No results found
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Try another name or keyword
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================
            PLUS BUTTON
        ====================================== */}

        <div ref={menuRef} className="relative flex-shrink-0 group">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className={`
              w-[46px]
              h-[46px]
              flex
              items-center
              justify-center
              rounded-xl
              cursor-pointer
              transition-all
              duration-300
              border

              ${
                showMenu
                  ? `
                    bg-[#4B49AC]
                    border-[#4B49AC]
                    text-white
                    shadow-lg
                    shadow-indigo-500/30
                  `
                  : `
                    bg-gray-50
                    border-gray-200
                    text-gray-600
                    hover:bg-[#4B49AC]
                    hover:border-[#4B49AC]
                    hover:text-white
                    hover:shadow-lg
                    hover:shadow-indigo-500/20
                  `
              }
            `}
          >
            <GoPlus
              size={23}
              className={`
                transition-transform
                duration-300
                ${showMenu ? "rotate-45" : "rotate-0"}
              `}
            />
          </button>
          <span
            className="
    absolute
    left-1/2
    -translate-x-1/2
    top-15
    px-3
    py-2
    rounded-lg
    bg-slate-900
    border
    border-slate-700
    text-white
    text-xs
    font-medium
    whitespace-nowrap
    opacity-0
    invisible
    translate-y-1
    group-hover:opacity-100
    group-hover:visible
    group-hover:translate-y-0
    transition-all
    duration-200
    shadow-xl
    z-[500]
    pointer-events-none
  "
          >
            Quick Add +
          </span>

          {/* =====================================
              ADD MENU
          ====================================== */}

          {showMenu && (
            <div
              className="
                absolute
                top-[55px]
                right-0
                bg-white
                border
                border-gray-200
                shadow-[0_15px_40px_rgba(15,23,42,0.15)]
                rounded-2xl
                w-[220px]
                overflow-hidden
                z-[400]
                animate-[fadeIn_.15s_ease-out]
              "
            >
              {/* LEAD */}
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onAddLead();
                }}
                className="
                  w-full
                  px-4
                  py-3.5
                  flex
                  items-center
                  gap-3
                  hover:bg-blue-50
                  cursor-pointer
                  transition-all
                  duration-200
                  text-left
                  group
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    group-hover:bg-blue-600
                    group-hover:text-white
                    transition
                  "
                >
                  <BiTargetLock size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Lead</p>

                  <p className="text-xs text-gray-400">Add a new lead</p>
                </div>

                <HiOutlineChevronRight className="text-gray-300 group-hover:text-blue-500" />
              </button>

              {/* ORGANIZATION */}
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onAddOrganization();
                }}
                className="
                  w-full
                  px-4
                  py-3.5
                  flex
                  items-center
                  gap-3
                  hover:bg-violet-50
                  cursor-pointer
                  transition-all
                  duration-200
                  text-left
                  group
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-violet-100
                    text-violet-600
                    flex
                    items-center
                    justify-center
                    group-hover:bg-violet-600
                    group-hover:text-white
                    transition
                  "
                >
                  <HiOutlineBuildingOffice2 size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Organization
                  </p>

                  <p className="text-xs text-gray-400">Add an organization</p>
                </div>

                <HiOutlineChevronRight className="text-gray-300 group-hover:text-violet-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          USER
      ====================================== */}

      {/* =====================================
    USER ACCOUNT
====================================== */}

      <div className="relative ml-auto flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowAccountMenu((prev) => !prev)}
          className="
      flex
      items-center
      gap-3
      cursor-pointer
      rounded-xl
      px-2
      py-1.5
      hover:bg-gray-50
      transition
    "
        >
          {/* PROFILE PHOTO */}

          <div
            className="
        w-10
        h-10
        rounded-full
        overflow-hidden
        bg-[#4B49AC]
        flex
        items-center
        justify-center
        text-white
        font-semibold
        shadow-md
      "
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* NAME */}

          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-700">{userName}</p>

            <p className="text-[11px] text-gray-400">My Account</p>
          </div>

          <ChevronDown
            size={17}
            className={`
        text-gray-400
        transition
        ${showAccountMenu ? "rotate-180" : ""}
      `}
          />
        </button>

        {/* =====================================
      ACCOUNT MENU
  ====================================== */}

        {showAccountMenu && (
          <div
            className="
        absolute
        right-0
        top-[58px]
        w-[280px]
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-[0_15px_45px_rgba(15,23,42,0.15)]
        overflow-hidden
        z-[500]
      "
          >
            {/* HEADER */}

            <div className="px-5 py-5  ">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                My Account
              </p>

              <div className="flex items-center gap-3 mt-4">
                <div
                  className="
              w-11
              h-11
              rounded-full
              overflow-hidden
              bg-gradient-to-br
              from-indigo-500
              to-blue-500
              flex
              items-center
              justify-center
              text-white
              font-semibold
            "
                >
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {userName}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {localStorage.getItem("userEmail") || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* PERSONAL PREFERENCES */}

            <button
              type="button"
              onClick={() => {
                setShowAccountMenu(false);

                navigate("/settings/profile");
              }}
              className="
          w-full
          px-5
          py-4
          flex
          items-center
          gap-3
          text-left
          hover:bg-gray-50
          transition
        "
            >
              <div
                className="
            w-9
            h-9
            rounded-lg
            bg-indigo-50
            text-[#4B49AC]
            flex
            items-center
            justify-center
          "
              >
                <User size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Personal preferences
                </p>

                <p className="text-xs text-gray-400">Manage your profile</p>
              </div>
            </button>

            {/* LOGOUT */}

            <div className="">
              <button
                type="button"
                onClick={handleLogout}
                className="
            w-full
            px-5
            py-4
            flex
            items-center
            gap-3
            text-left
            hover:bg-red-50
            transition
            text-red-600
          "
              >
                <div
                  className="
              w-9
              h-9
              rounded-lg
              bg-red-50
              flex
              items-center
              justify-center
            "
                >
                  <LogOut size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium">Log out</p>

                  <p className="text-xs text-red-400">
                    Sign out of your account
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
