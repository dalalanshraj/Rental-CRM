import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // 🔥 FETCH LEADS
  const fetchLeads = async () => {
    try {
      const res = await api.get(`/leads?search=${search}`);
      setLeads(res.data);

      // auto select first
      if (!selected && res.data.length > 0) {
        setSelected(res.data[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F6F8]">

      {/* CONTACT SIDEBAR */}
      <div className="w-64 bg-white border-r p-4">

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        {leads.map((lead) => (
          <div
            key={lead._id}
            onClick={() => setSelected(lead)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selected?._id === lead._id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <p className="font-medium">{lead.name}</p>
            <p className="text-xs text-gray-500">
              {lead.organization}
            </p>
          </div>
        ))}

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b flex justify-between">
          <h2 className="text-xl font-semibold">
            {selected?.name || "Select Lead"}
          </h2>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + Deal
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1">

          {/* DETAILS */}
          <div className="w-[380px] bg-white border-r p-6">

            {selected ? (
              <>
                <p><strong>Name:</strong> {selected.name}</p>
                <p><strong>Email:</strong> {selected.email?.address}</p>
                <p><strong>Phone:</strong> {selected.phone?.number}</p>
                <p><strong>Owner:</strong> {selected.owner?.name}</p>
              </>
            ) : (
              <p>No Lead Selected</p>
            )}

          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 p-6">
            <p className="text-gray-500">
              Activity / Notes (next step)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}