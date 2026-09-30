 import { useCallback, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AddLeadModal from "../components/AddLeadModal";
import AddOrganizationModal from "../components/AddOrganizationModal";
import api from "../api/axios";

export default function MainLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState([]);

  const [showOrganizationModal, setShowOrganizationModal] =
    useState(false);

  const searchControllerRef = useRef(null);


const handleSearch = useCallback(async (query) => {
  const search = query.trim();

  // EMPTY SEARCH
  if (!search) {
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
      searchControllerRef.current = null;
    }

    setResults([]);
    return;
  }

  // CANCEL PREVIOUS REQUEST
  if (searchControllerRef.current) {
    searchControllerRef.current.abort();
  }

  // NEW CONTROLLER
  const controller = new AbortController();

  searchControllerRef.current = controller;

  try {
    const res = await api.get(
      `/search?q=${encodeURIComponent(search)}`,
      {
        signal: controller.signal,
      }
    );

    if (controller.signal.aborted) {
      return;
    }

    setResults(
      Array.isArray(res.data) ? res.data : []
    );

  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    console.error("Global search error:", error);

    setResults([]);

  } finally {
    if (searchControllerRef.current === controller) {
      searchControllerRef.current = null;
    }
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="ml-[82px] min-h-screen flex flex-col">

        {/* NAVBAR */}
        <Navbar
          onSearch={handleSearch}
          searchResults={results}
          onAddLead={() => setShowModal(true)}
          onAddDeal={() => alert("Deal modal coming")}
          onAddOrganization={() =>
            setShowOrganizationModal(true)
          }
        />

        {/* MODALS */}
        {showModal && (
          <AddLeadModal
            onClose={() => setShowModal(false)}
          />
        )}

        {showOrganizationModal && (
          <AddOrganizationModal
            onClose={() =>
              setShowOrganizationModal(false)
            }
          />
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1">
          <div className="p-5 bg-gray-100 min-h-[calc(100vh-90px)]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}