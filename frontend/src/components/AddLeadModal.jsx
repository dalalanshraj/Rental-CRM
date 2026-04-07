import { useState } from "react";
import api from "../api/axios";

export default function AddLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async () => {
    const res = await api.post("/leads", {
      name: form.name,
      organization: form.organization,
      email: { address: form.email },
      phone: { number: form.phone },
    });

    onCreated(res.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96">

        <h2 className="font-bold mb-4">Add Lead</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

      </div>
    </div>
  );
}