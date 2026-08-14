import { Link, useLocation } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa";
import { RiContactsBook3Line } from "react-icons/ri";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    {
      icon: <MdOutlineDashboard size={25} />,
      label: "Dashboard",
      path: "/app/dashboard",
    },
    {
      icon: <IoPeopleOutline size={25} />,
      label: "People",
      path: "/app/leads",
    },
    {
      icon: <FaRegCalendarCheck size={23} />,
      label: "Activities",
      path: "/app/activities",
    },
    {
      icon: <RiContactsBook3Line size={25} />,
      label: "Organizations",
      path: "/app/organizations",
    },
  ];

  return (
  <aside className="fixed top-0 left-0 z-50 w-[82px] h-screen bg-white  ">

  {/* LOGO */}
  <div className="relative w-[89px] h-[90px] flex items-center justify-center">
  <img
    src="/Logo.png"
    alt="Digify America CRM"
    className="ab w-[72px] h-[72px] object-contain"
  />
</div>

  {/* MENU */}
  <ul className="flex flex-col items-center gap-4 px-3">
        {menu.map((item) => {
          const isActive =
            pathname === item.path ||
            pathname.startsWith(`${item.path}/`);

          return (
            <li key={item.path} className="w-full">
              <Link
                to={item.path}
                title={item.label}
                className={`
                  group relative
                  flex items-center justify-center
                  w-full h-12
                  rounded-xl
                  transition-all duration-300

                  ${
                    isActive
                      ? "bg-[#4B49AC] text-white"
                      : "text-slate-400 hover:bg-[#4B49AC] hover:text-white"
                  }
                `}
              >
                <span
                  className={`
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-white"
                        : "text-[#6C7383] group-hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* Tooltip */}
                <span
                  className="
                    absolute left-[65px]
                    px-3 py-2
                    rounded-lg
                    bg-slate-900
                    border border-slate-700
                    text-white text-xs
                    whitespace-nowrap
                    opacity-0 invisible
                    translate-x-1
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-x-0
                    transition-all duration-200
                    shadow-xl
                  "
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}