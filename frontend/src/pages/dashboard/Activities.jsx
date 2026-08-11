 import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Search,
  ChevronDown,
  Check,
  Clock3,
  Phone,
  Mail,
  Users,
  CalendarDays,
  ListTodo,
  Target,
  CircleDollarSign,
  Building2,
  MoreHorizontal,
} from "lucide-react";

export default function Activities() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState("all");

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const [periodFilter, setPeriodFilter] =
    useState("todo");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth");

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Fetch users error:",
        err
      );
    }
  };

  // =========================================================
  // FETCH ACTIVITIES
  // =========================================================

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        "/activities",
        {
          params: {
            userId: selectedUser,
          },
        }
      );

      setActivities(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Fetch activities error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load activities."
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [selectedUser]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hour),
      Number(minute)
    );

    return date.toLocaleTimeString(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    dateValue,
    timeValue
  ) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    const dateText =
      date.toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

    if (!timeValue) {
      return dateText;
    }

    return `${dateText} at ${formatTime(
      timeValue
    )}`;
  };

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const startOfDay = (date) => {
    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    return d;
  };

  const endOfDay = (date) => {
    const d = new Date(date);

    d.setHours(
      23,
      59,
      59,
      999
    );

    return d;
  };

  const addDays = (
    date,
    amount
  ) => {
    const d = new Date(date);

    d.setDate(
      d.getDate() + amount
    );

    return d;
  };

  // =========================================================
  // FILTER ACTIVITIES
  // =========================================================

  const filteredActivities = useMemo(() => {
    const now = new Date();

    const todayStart =
      startOfDay(now);

    const todayEnd =
      endOfDay(now);

    const tomorrowStart =
      startOfDay(
        addDays(now, 1)
      );

    const tomorrowEnd =
      endOfDay(
        addDays(now, 1)
      );

    const weekStart =
      startOfDay(now);

    const weekEnd =
      endOfDay(
        addDays(now, 7)
      );

    const nextWeekStart =
      startOfDay(
        addDays(now, 7)
      );

    const nextWeekEnd =
      endOfDay(
        addDays(now, 14)
      );

    const text =
      search
        .trim()
        .toLowerCase();

    const result =
      activities.filter(
        (activity) => {

          // =================================================
          // TYPE FILTER
          // =================================================

          if (
            typeFilter !== "all" &&
            activity.type !== typeFilter
          ) {
            return false;
          }

          // =================================================
          // PERIOD FILTER
          // =================================================

          const dueDate =
            activity.dueDate
              ? new Date(
                  activity.dueDate
                )
              : null;

          if (dueDate) {
            if (
              periodFilter ===
              "overdue"
            ) {
              if (
                activity.status ===
                  "completed" ||
                dueDate >=
                  todayStart
              ) {
                return false;
              }
            }

            if (
              periodFilter ===
              "today"
            ) {
              if (
                dueDate <
                  todayStart ||
                dueDate >
                  todayEnd
              ) {
                return false;
              }
            }

            if (
              periodFilter ===
              "tomorrow"
            ) {
              if (
                dueDate <
                  tomorrowStart ||
                dueDate >
                  tomorrowEnd
              ) {
                return false;
              }
            }

            if (
              periodFilter ===
              "this-week"
            ) {
              if (
                dueDate <
                  weekStart ||
                dueDate >
                  weekEnd
              ) {
                return false;
              }
            }

            if (
              periodFilter ===
              "next-week"
            ) {
              if (
                dueDate <
                  nextWeekStart ||
                dueDate >
                  nextWeekEnd
              ) {
                return false;
              }
            }

            // TODO
            //
            // Pending activities only
            if (
              periodFilter ===
              "todo"
            ) {
              if (
                activity.status ===
                "completed"
              ) {
                return false;
              }
            }
          }

          // =================================================
          // SEARCH
          // =================================================

          if (!text) {
            return true;
          }

          const title =
            activity.title
              ?.toLowerCase() ||
            "";

          const description =
            activity.description
              ?.toLowerCase() ||
            "";

          const owner =
            activity.owner?.name
              ?.toLowerCase() ||
            "";

          const ownerEmail =
            activity.owner?.email
              ?.toLowerCase() ||
            "";

          const leadName =
            activity.lead?.name
              ?.toLowerCase() ||
            "";

          const organizationName =
            activity.organization
              ?.name
              ?.toLowerCase() ||
            "";

          const leadEmail =
            activity.lead?.email?.[0]
              ?.address
              ?.toLowerCase() ||
            "";

          const organizationEmail =
            activity.organization?.email
              ?.toLowerCase() ||
            "";

          const leadPhone =
            String(
              activity.lead?.phone?.[0]
                ?.number || ""
            ).toLowerCase();

          const organizationPhone =
            String(
              activity.organization
                ?.phone || ""
            ).toLowerCase();

          const website =
            activity.lead?.website
              ?.toLowerCase() ||
            activity.organization
              ?.website
              ?.toLowerCase() ||
            "";

          const type =
            activity.type
              ?.toLowerCase() ||
            "";

          return (
            title.includes(text) ||
            description.includes(text) ||
            owner.includes(text) ||
            ownerEmail.includes(text) ||
            leadName.includes(text) ||
            organizationName.includes(text) ||
            leadEmail.includes(text) ||
            organizationEmail.includes(text) ||
            leadPhone.includes(text) ||
            organizationPhone.includes(text) ||
            website.includes(text) ||
            type.includes(text)
          );
        }
      );

    // =======================================================
    // SORT
    // =======================================================

    return result.sort(
      (a, b) => {

        // Pending first
        if (
          a.status !==
          b.status
        ) {
          return a.status ===
            "pending"
            ? -1
            : 1;
        }

        // Then date
        const dateA =
          new Date(
            a.dueDate
          ).getTime();

        const dateB =
          new Date(
            b.dueDate
          ).getTime();

        return dateA - dateB;
      }
    );
  }, [
    activities,
    search,
    typeFilter,
    periodFilter,
  ]);

  // =========================================================
  // GET CONTACT
  // =========================================================

  const getContact = (
    activity
  ) => {
    if (activity.lead) {
      return {
        type: "lead",
        id: activity.lead._id,
        name: activity.lead.name,
      };
    }

    if (
      activity.organization
    ) {
      return {
        type: "organization",
        id: activity.organization._id,
        name: activity.organization.name,
      };
    }

    return null;
  };

  // =========================================================
  // OPEN CONTACT
  // =========================================================

  const openContact = (
    activity
  ) => {
    const contact =
      getContact(activity);

    if (!contact) {
      return;
    }

    if (
      contact.type ===
      "lead"
    ) {
      navigate(
        `/app/leads/${contact.id}`
      );

      return;
    }

    if (
      contact.type ===
      "organization"
    ) {
      navigate(
        `/app/organizations/${contact.id}`
      );
    }
  };

  // =========================================================
  // GET EMAIL
  // =========================================================

  const getEmail = (
    activity
  ) => {
    return (
      activity.lead?.email?.[0]
        ?.address ||
      activity.organization
        ?.email ||
      ""
    );
  };

  // =========================================================
  // GET PHONE
  // =========================================================

  const getPhone = (
    activity
  ) => {
    return (
      activity.lead?.phone?.[0]
        ?.number ||
      activity.organization
        ?.phone ||
      ""
    );
  };

  // =========================================================
  // ACTIVITY ICON
  // =========================================================

  const getActivityIcon = (
    type
  ) => {
    switch (type) {
      case "call":
        return (
          <Phone
            size={16}
          />
        );

      case "email":
        return (
          <Mail
            size={16}
          />
        );

      case "meeting":
        return (
          <Users
            size={16}
          />
        );

      case "deadline":
        return (
          <CalendarDays
            size={16}
          />
        );

      default:
        return (
          <ListTodo
            size={16}
          />
        );
    }
  };

  // =========================================================
  // ACTIVITY ICON STYLE
  // =========================================================

  const getActivityIconStyle = (
    type
  ) => {
    switch (type) {
      case "call":
        return "bg-blue-100 text-blue-600";

      case "email":
        return "bg-green-100 text-green-600";

      case "meeting":
        return "bg-purple-100 text-purple-600";

      case "deadline":
        return "bg-red-100 text-red-600";

      default:
        return "bg-orange-100 text-orange-600";
    }
  };

  // =========================================================
  // COUNT
  // =========================================================

  const activityCount =
    filteredActivities.length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="
        flex
        flex-col
        xl:flex-row
        xl:items-center
        xl:justify-between
        gap-4
        mb-5
      ">

        {/* TITLE */}

        <div>

          <h1 className="
            text-2xl
            font-semibold
            text-gray-800
          ">
            Activities
          </h1>

          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Manage activities across your team
          </p>

        </div>

        {/* SEARCH + USER */}

        <div className="
          flex
          flex-col
          sm:flex-row
          gap-3
          w-full
          xl:w-auto
        ">

          {/* SEARCH */}

          <div className="
            relative
            w-full
            sm:w-[320px]
          ">

            <Search
              size={18}
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
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search activities..."
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                pl-10
                pr-4
                py-2.5
                text-sm
                outline-none
                bg-white
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

          {/* USER */}

          <div className="relative">

            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(
                  e.target.value
                )
              }
              className="
                appearance-none
                w-full
                sm:w-[190px]
                border
                border-gray-300
                rounded-xl
                px-4
                py-2.5
                pr-10
                text-sm
                bg-white
                outline-none
                cursor-pointer
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >

              <option value="all">
                All Users
              </option>

              {users.map(
                (user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name}
                  </option>
                )
              )}

            </select>

            <ChevronDown
              size={17}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          TYPE FILTERS
      ====================================================== */}

      <div className="
        flex
        items-center
        gap-2
        overflow-x-auto
        pb-2
        mb-2
      ">

        {[
          {
            value: "all",
            label: "All",
            icon: (
              <ListTodo
                size={16}
              />
            ),
          },
          {
            value: "task",
            label: "Tasks",
            icon: (
              <Target
                size={16}
              />
            ),
          },
          {
            value: "call",
            label: "Calls",
            icon: (
              <Phone
                size={16}
              />
            ),
          },
          {
            value: "email",
            label: "Emails",
            icon: (
              <Mail
                size={16}
              />
            ),
          },
          {
            value: "meeting",
            label: "Meetings",
            icon: (
              <Users
                size={16}
              />
            ),
          },
          {
            value: "deadline",
            label: "Deadlines",
            icon: (
              <CalendarDays
                size={16}
              />
            ),
          },
        ].map(
          (item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setTypeFilter(
                  item.value
                )
              }
              className={`
                flex
                items-center
                gap-2
                whitespace-nowrap
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                border
                transition
                ${
                  typeFilter ===
                  item.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              {item.icon}

              {item.label}
            </button>
          )
        )}

      </div>


      {/* =====================================================
          PERIOD FILTER
      ====================================================== */}

      <div className="
        flex
        items-center
        gap-6
        overflow-x-auto
        border-b
        border-gray-200
        mb-5
      ">

        {[
          ["todo", "To-do"],
          ["overdue", "Overdue"],
          ["today", "Today"],
          ["tomorrow", "Tomorrow"],
          ["this-week", "This week"],
          ["next-week", "Next week"],
          ["all", "All"],
        ].map(
          ([value, label]) => (

            <button
              key={value}
              type="button"
              onClick={() =>
                setPeriodFilter(
                  value
                )
              }
              className={`
                whitespace-nowrap
                py-3
                text-sm
                font-medium
                border-b-2
                -mb-px
                transition
                ${
                  periodFilter ===
                  value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }
              `}
            >
              {label}
            </button>

          )
        )}

      </div>


      {/* =====================================================
          TABLE HEADER
      ====================================================== */}

      <div className="
        flex
        items-center
        justify-between
        mb-3
      ">

        <div className="
          flex
          items-center
          gap-2
        ">

          <span className="
            text-sm
            font-semibold
            text-gray-700
          ">
            {activityCount}
          </span>

          <span className="
            text-sm
            text-gray-500
          ">
            activities
          </span>

        </div>

        <button
          type="button"
          onClick={fetchActivities}
          className="
            text-sm
            text-blue-600
            hover:text-blue-700
            font-medium
          "
        >
          Refresh
        </button>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="
          mb-4
          rounded-xl
          border
          border-red-200
          bg-red-50
          text-red-600
          px-4
          py-3
          text-sm
        ">
          {error}
        </div>
      )}


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            min-w-[1100px]
            text-sm
          ">

            {/* TABLE HEAD */}

            <thead className="
              bg-gray-50
              border-b
              border-gray-200
            ">

              <tr>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                  w-[70px]
                ">
                  Done
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Subject
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Contact
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Organization
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Email
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Phone
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Date
                </th>

                <th className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-600
                ">
                  Owner
                </th>

                <th className="
                  w-[50px]
                  px-3
                  py-3
                ">
                  <MoreHorizontal
                    size={18}
                    className="text-gray-400"
                  />
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {/* LOADING */}

              {loading && (
                <>
                  {[1, 2, 3, 4, 5].map(
                    (item) => (
                      <tr
                        key={item}
                        className="
                          border-b
                          border-gray-100
                        "
                      >

                        {Array.from({
                          length: 9,
                        }).map(
                          (_, index) => (
                            <td
                              key={index}
                              className="px-4 py-5"
                            >
                              <div className="
                                h-4
                                bg-gray-100
                                rounded
                                animate-pulse
                                w-24
                              " />
                            </td>
                          )
                        )}

                      </tr>
                    )
                  )}
                </>
              )}


              {/* EMPTY */}

              {!loading &&
                filteredActivities.length ===
                  0 && (
                  <tr>

                    <td
                      colSpan="9"
                      className="
                        text-center
                        py-16
                        text-gray-400
                      "
                    >

                      <div className="
                        flex
                        flex-col
                        items-center
                      ">

                        <div className="
                          w-14
                          h-14
                          rounded-full
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          mb-3
                        ">
                          <CalendarDays
                            size={26}
                          />
                        </div>

                        <p className="
                          font-medium
                          text-gray-600
                        ">
                          No activities found
                        </p>

                        <p className="
                          text-sm
                          mt-1
                        ">
                          Try changing your filters or search.
                        </p>

                      </div>

                    </td>

                  </tr>
                )}


              {/* ACTIVITIES */}

              {!loading &&
                filteredActivities.map(
                  (activity) => {

                    const contact =
                      getContact(
                        activity
                      );

                    const email =
                      getEmail(
                        activity
                      );

                    const phone =
                      getPhone(
                        activity
                      );

                    return (
                      <tr
                        key={
                          activity._id
                        }
                        className="
                          border-b
                          border-gray-100
                          hover:bg-blue-50/50
                          transition-colors
                        "
                      >

                        {/* DONE */}

                        <td className="
                          px-4
                          py-4
                        ">

                          <div className="
                            flex
                            items-center
                          ">

                            {activity.status ===
                            "completed" ? (

                              <div className="
                                w-6
                                h-6
                                rounded-full
                                bg-green-500
                                text-white
                                flex
                                items-center
                                justify-center
                              ">
                                <Check
                                  size={15}
                                />
                              </div>

                            ) : (

                              <div className="
                                w-6
                                h-6
                                rounded-full
                                border-2
                                border-gray-300
                              " />

                            )}

                          </div>

                        </td>


                        {/* SUBJECT */}

                        <td className="
                          px-4
                          py-4
                          truncate
                        ">

                          <div className="
                            flex
                            items-start
                            gap-3
                          ">

                            <div
                              className={`
                                flex
                                items-center
                                justify-center
                                
                                w-9
                                h-9
                                rounded-lg
                                flex-shrink-0
                                ${getActivityIconStyle(
                                  activity.type
                                )}
                              `}
                            >
                              {getActivityIcon(
                                activity.type
                              )}
                            </div>

                            <div className="min-w-0">

                              <button
                                type="button"
                                onClick={() =>
                                  openContact(
                                    activity
                                  )
                                }
                                className={`
                                  font-semibold
                                  text-left
                                  hover:underline
                                  ${
                                    activity.status ===
                                    "completed"
                                      ? "text-gray-400 line-through"
                                      : "text-gray-800 hover:text-blue-600"
                                  }
                                `}
                              >
                                {
                                  activity.title
                                }
                              </button>

                              <div className="
                                text-xs
                                
                                text-gray-400
                                mt-1
                                capitalize
                                
                              ">
                                {
                                  activity.type
                                }
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td className="
                          px-4
                          py-4
                        ">

                          {contact ? (

                            <button
                              type="button"
                              onClick={() =>
                                openContact(
                                  activity
                                )
                              }
                              className="
                                text-blue-600
                                hover:underline
                                font-medium
                                truncate
                                text-left
                              "
                            >
                              {
                                contact.name
                              }
                            </button>

                          ) : (
                            <span className="
                              text-gray-400
                            ">
                              —
                            </span>
                          )}

                        </td>


                        {/* ORGANIZATION */}

                        <td className="
                          px-4
                          py-4
                        ">

                          {activity.organization ? (

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/app/organizations/${activity.organization._id}`
                                )
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                truncate
                                text-blue-600
                                hover:underline
                                text-left
                              "
                            >

                              <Building2
                                size={15}
                              />

                              {
                                activity
                                  .organization
                                  .name
                              }

                            </button>

                          ) : (
                            <span className="
                              text-gray-400
                            ">
                              —
                            </span>
                          )}

                        </td>


                        {/* EMAIL */}

                        <td className="
                          px-4
                          py-4
                        ">

                          {email ? (

                            <a
                              href={`mailto:${email}`}
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                text-blue-600
                                hover:underline
                                max-w-[220px]
                              "
                              title={email}
                            >

                              <Mail
                                size={15}
                                className="
                                  flex-shrink-0
                                "
                              />

                              <span className="
                                
                              ">
                                {email}
                              </span>

                            </a>

                          ) : (
                            <span className="
                              text-gray-400
                            ">
                              —
                            </span>
                          )}

                        </td>


                        {/* PHONE */}

                        <td className="
                          px-4
                          py-4
                        ">

                          {phone ? (

                            <a
                              href={`tel:${phone}`}
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                text-blue-600
                                hover:underline
                              "
                            >

                              <Phone
                                size={15}
                              />

                              {phone}

                            </a>

                          ) : (
                            <span className="
                              text-gray-400
                            ">
                              —
                            </span>
                          )}

                        </td>


                        {/* DATE */}

                        <td className="
                          px-4
                          py-4
                          whitespace-nowrap
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            text-gray-700
                          ">

                            <Clock3
                              size={15}
                              className="
                                text-gray-400
                              "
                            />

                            {formatDate(
                              activity.dueDate,
                              activity.startTime
                            )}

                          </div>

                        </td>


                        {/* OWNER */}

                        <td className="
                          px-4
                          py-4
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <div className="
                              w-8
                              h-8
                              rounded-full
                              bg-[#4B49AC]
                              text-white
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-semibold
                              flex-shrink-0
                            ">

                              {activity.owner
                                ?.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "U"}

                            </div>

                            <span className="
                              text-gray-700
                              whitespace-nowrap
                            ">
                              {activity
                                .owner
                                ?.name ||
                                "—"}
                            </span>

                          </div>

                        </td>


                        {/* MENU */}

                        <td className="
                          px-3
                          py-4
                        ">

                          <button
                            type="button"
                            className="
                              w-8
                              h-8
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-gray-400
                              hover:bg-gray-100
                              hover:text-gray-700
                            "
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}