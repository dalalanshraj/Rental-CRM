import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AddLeadModal from "../components/AddLeadModal";

export default function MainLayout({ children }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1">

        {/* NAVBAR */}
        <Navbar
          onSearch={setSearch}
          onAddLead={() => setShowModal(true)}
        />

        {/* MODAL */}
        {showModal && (
          <AddLeadModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              // optional: trigger refresh
            }}
          />
        )}

        {/* PAGE */}
        <div className="p-5 bg-gray-100 min-h-screen">
          {children(search)}
        </div>

      </div>
    </div>
  );
}