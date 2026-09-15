 import React from "react";
import { Download } from "lucide-react";
import api from "../api/axios";

export default function Settings() {


    const handleExport = async () => {
  try {
    const response = await api.get("/export", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-data.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to export data."
    );
  }
};

  return (
    <div className="p-6 sm:p-8 mt-20">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your CRM settings and data.
          </p>
        </div>

        {/* DATA MANAGEMENT */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Data Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Export or import your CRM data.
            </p>
          </div>

          {/* EXPORT */}
          <div className="px-6 py-6 flex items-center justify-between gap-5">

            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Export Data
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Download your Organizations, Leads and Deals data as an Excel file.
              </p>
            </div>

          <button
  type="button"
  onClick={handleExport}
  className="
    shrink-0
    inline-flex
    items-center
    gap-2
    px-5
    py-2.5
    rounded-xl
    bg-[#4B49AC]
    text-white
    text-sm
    font-medium
    hover:bg-[#3f3d91]
    transition
  "
>
  <Download size={17} />
  Export Data
</button>

          </div>

        </div>

      </div>
    </div>
  );
}