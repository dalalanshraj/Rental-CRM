import { useState } from "react";
import api from "../api/axios";

export default function AddOrganizationModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "",
    phone: "",
    email: "",
    currentBookingPalAccount: "",
    nextListingExpirationDate: "",
    ecbyoDiscount: "",
    ecbyoLoginEmail: "",
    ecbyoPass: "",
    vrsUsed: "",
    vrsId: "",
    monthsOfCredit: "",
    totalUnitsManaged: "",
    notes: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];

      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Organization name is required");
      return;
    }

    try {
      await api.post("/organizations", form);
      onClose();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-200 h-180 rounded-2xl shadow-2xl overflow-scroll relative">

        <div className="flex">
          {/* LEFT SIDE */}
          <div className="w-1/2 p-6 border-r bg-gray-50">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Add Organization
            </h2>

            <input
              name="name"
              placeholder="Organization name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="website"
              placeholder="Website"
              value={form.website}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="industry"
              placeholder="Industry"
              value={form.industry}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="phone"
              placeholder="Company phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="email"
              placeholder="Company email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Extra Details
            </h3>

            <input
              name="currentBookingPalAccount"
              placeholder="Current Booking Pal Account"
              value={form.currentBookingPalAccount}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="date"
              name="nextListingExpirationDate"
              value={form.nextListingExpirationDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="ecbyoDiscount"
              placeholder="ECBYO Discount"
              value={form.ecbyoDiscount}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="ecbyoLoginEmail"
              placeholder="ECBYO Login Email"
              value={form.ecbyoLoginEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="ecbyoPass"
              placeholder="ECBYO Password"
              value={form.ecbyoPass}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="vrsUsed"
              placeholder="VRS Used"
              value={form.vrsUsed}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="vrsId"
              placeholder="VRS ID"
              value={form.vrsId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="monthsOfCredit"
              placeholder="Months of Credit"
              value={form.monthsOfCredit}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="totalUnitsManaged"
              placeholder="Total Units Managed"
              value={form.totalUnitsManaged}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">
              Address
            </h3>

            <input
              name="address.street"
              placeholder="Street"
              value={form.address.street}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="address.city"
                placeholder="City"
                value={form.address.city}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="address.state"
                placeholder="State"
                value={form.address.state}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="address.country"
                placeholder="Country"
                value={form.address.country}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="address.zipCode"
                placeholder="Zip Code"
                value={form.address.zipCode}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-5 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Save Organization
          </button>
        </div>
      </div>
    </div>
  );
}