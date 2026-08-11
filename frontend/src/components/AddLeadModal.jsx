import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddLeadModal({ onClose }) {
  const [organizations, setOrganizations] = useState([]);
  const [organizationSearch, setOrganizationSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    organization: "",
    title: "",
    value: "",
    sourceChannel: "",
    sourceChannelId: "",
    expectedCloseDate: "",
  });

  const [phones, setPhones] = useState([
    { number: "", label: "work" }
  ]);

  const [emails, setEmails] = useState([
    { address: "", label: "work" }
  ]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get("/organizations");
      setOrganizations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (i, value) => {
    const newPhones = [...phones];
    newPhones[i].number = value;
    setPhones(newPhones);
  };

  const handlePhoneLabelChange = (i, value) => {
    const newPhones = [...phones];
    newPhones[i].label = value;
    setPhones(newPhones);
  };

  const handleEmailChange = (i, value) => {
    const newEmails = [...emails];
    newEmails[i].address = value;
    setEmails(newEmails);
  };

  const handleEmailLabelChange = (i, value) => {
    const newEmails = [...emails];
    newEmails[i].label = value;
    setEmails(newEmails);
  };

  const addPhone = () => {
    setPhones([...phones, { number: "", label: "work" }]);
  };

  const addEmail = () => {
    setEmails([...emails, { address: "", label: "work" }]);
  };

 const handleSubmit = async () => {
  if (!form.name.trim()) {
    alert("Name is required");
    return;
  }

  try {

    const payload = {
      ...form,
      phone: phones.filter((p) => p.number.trim()),
      email: emails.filter((e) => e.address.trim()),
    };

    // 👇 Organization sirf tab bhejo jab select ki ho
    if (!payload.organization) {
      delete payload.organization;
    }

    console.log(payload);

    await api.post("/leads", payload);

    onClose();

  } catch (err) {
    console.log(err.response?.data || err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-[900px] rounded-2xl shadow-2xl flex relative overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 p-6 border-r bg-gray-50">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            Add Lead
          </h2>

          <input
            name="name"
            placeholder="Contact person"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Organization Search */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search organization..."
              value={organizationSearch}
              onChange={(e) => setOrganizationSearch(e.target.value)}
              className="w-full border border-gray-300 p-2.5 mb-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              name="organization"
              value={form.organization}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Organization</option>

              {organizations
                .filter((org) =>
                  org.name
                    ?.toLowerCase()
                    .includes(organizationSearch.toLowerCase())
                )
                .map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
            </select>
          </div>

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="value"
            placeholder="Value"
            value={form.value}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="sourceChannel"
            placeholder="Source channel"
            value={form.sourceChannel}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="sourceChannelId"
            placeholder="Source channel ID"
            value={form.sourceChannelId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 mb-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="date"
            name="expectedCloseDate"
            value={form.expectedCloseDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 p-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Person
          </h3>

          {/* PHONE */}
          <div className="mb-5">
            <label className="text-sm text-gray-500 mb-2 block">
              Phone
            </label>

            {phones.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={p.number}
                  onChange={(e) => handlePhoneChange(i, e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  value={p.label}
                  onChange={(e) => handlePhoneLabelChange(i, e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                  <option value="mobile">Mobile</option>
                  <option value="other">Other</option>
                </select>
              </div>
            ))}

            <button
              onClick={addPhone}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add phone
            </button>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Email
            </label>

            {emails.map((e, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={e.address}
                  onChange={(event) =>
                    handleEmailChange(i, event.target.value)
                  }
                  placeholder="Email address"
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  value={e.label}
                  onChange={(event) =>
                    handleEmailLabelChange(i, event.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                  <option value="mobile">Mobile</option>
                  <option value="other">Other</option>
                </select>
              </div>
            ))}

            <button
              onClick={addEmail}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add email
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-5 right-8 flex gap-3">
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}