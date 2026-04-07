import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/app/dashboard" },
    { name: "Leads", path: "/app/leads" },
    { name: "Deals", path: "/app/deals" },
    { name: "Clients", path: "/app/clients" },
  ];

  return (
    <div className="w-64 h-screen bg-[#1E1B4B] text-white p-5">
      <h2 className="text-xl font-bold mb-8">CRM</h2>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-2 rounded ${
                pathname === item.path
                  ? "bg-indigo-500"
                  : "hover:bg-indigo-400"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}