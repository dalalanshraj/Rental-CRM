import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import EditableField from "../../components/EditableField";
import EditableContactField from "../../components/EditableContactField";
import EditableLinkField from "../../components/EditableLinkField";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { LuBuilding } from "react-icons/lu";
import OwnerTransferDropdown from "../../components/ OwnerTransferDropdown";
import {
  Activity,
  StickyNote,
  Mail,
  FolderOpen,
} from "lucide-react";
import RightPanel from "../../components/RightSidePanel/RightPanel";

export default function OrganizationDetails() {
  const { id } = useParams();

  const [organization, setOrganization] = useState(null);
  const [openDetails, setOpenDetails] = useState(true);
  const [openAddress, setOpenAddress] = useState(true);
  const [openPeople, setOpenPeople] = useState(true);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [activeTab, setActiveTab] = useState("activity");
  const navigate = useNavigate();

  // FETCH DATA
  const fetchOrganization = async () => {
    try {
      const res = await api.get(`/organizations/${id}`);
      setOrganization(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setAvailableLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrganization();
    fetchLeads();
  }, [id]);

  // ADD LEAD
  const handleAddLead = async () => {
    if (!selectedLead) return;

    try {
     await api.put(`/organizations/${organization._id}/add-lead`, {
      
  leadId: selectedLead,
  
});

      setSelectedLead("");
      fetchOrganization();
    } catch (err) {
      console.log(err);
    }
  };

  // REMOVE LEAD
  const handleRemoveLead = async (leadId) => {
    try {
      await api.put(`/organizations/${organization._id}/remove-lead`, {
        leadId,
      });

      fetchOrganization();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredLeads = availableLeads.filter((lead) =>
    lead.name?.toLowerCase().includes(leadSearch.toLowerCase()),
  );

  if (!organization) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#f8fafc]">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
           <LuBuilding size={40} />
          </div>
         
          <div>
            <h2 className="text-xl font-semibold">
            <EditableField
              field="name"
              value={organization.name}
              itemId={organization._id}
              endpoint="organizations"
              onUpdate={setOrganization}
            />
          </h2>

           
          </div>
        </div>
        <OwnerTransferDropdown
  owner={organization.owner}
  entityId={organization._id}
  entityType="organizations"
  onSuccess={setOrganization}
/>
      </div>

      <div className="flex">
        {/* LEFT PANEL */}

        <div className="w-[360px] bg-white border-r min-h-screen p-4 overflow-y-auto ">
          {/* SUMMARY */}
          <div className="border-b pb-4 mb-4 hover:bg-gray-50 p-2 rounded-lg transition-all">
            <h3 className="font-semibold mb-2 text-gray-700">Summary</h3>

            <EditableContactField
              label="email"
              field="email"
              value={organization.email}
              type={organization.email?.[0]?.label || "Work"}
              itemId={organization._id}
              endpoint="organizations"
              onUpdate={setOrganization}
            />

            <EditableContactField
              label="phone"
              field="phone"
              value={organization.phone}
              type={organization.phone?.[0]?.label || "Work"}
              itemId={organization._id}
              endpoint="organizations"
              onUpdate={setOrganization}
            />
             <EditableField
                  label="Street"
                  field="address.street"
                  value={organization.address}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />
          </div>
          {/* DETAILS */}
          <div className="border-b pb-4 mb-4">
            <div
              onClick={() => setOpenDetails(!openDetails)}
              className="flex justify-between items-center cursor-pointer mb-3"
            >
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                {openDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
                Details
              </h3>
            </div>

            {openDetails && (
              <div className="space-y-3 text-sm">
                <EditableField
                  label="Name"
                  field="name"
                  value={organization.name}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />

                <EditableLinkField
                  label="Website"
                  field="website"
                  value={organization.website}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />

                <EditableField
                  label="Phone"
                  field="phone"
                  value={organization.phone}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />

                <EditableField
                  label="Email"
                  field="email"
                  value={organization.email}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />

                <EditableField
                  label="Industry"
                  field="industry"
                  value={organization.industry}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />

                <EditableField
                  label="Street"
                  field="address.street"
                  value={organization.address?.street}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />
                <EditableField
                  label="City"
                  field="address.city"
                  value={organization.address?.city}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />
                <EditableField
                  label="State"
                  field="address.state"
                  value={organization.address?.state}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />
                <EditableField
                  label="Country"
                  field="address.country"
                  value={organization.address?.country}
                  itemId={organization._id}
                  endpoint="organizations"
                  onUpdate={setOrganization}
                />
              </div>
            )}
          </div>

          {/* PEOPLE */}
          {/* PEOPLE */}
          <div className="">
            {/* HEADER */}
            <div
              onClick={() => setOpenPeople(!openPeople)}
              className="flex items-center justify-between mb-1 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                {openPeople ? <IoIosArrowUp /> : <IoIosArrowDown />}
                People
              </h3>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // important
                  setShowLeadModal(true);
                }}
                className="w-9 h-9 cursor-pointer flex items-center justify-center text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                +
              </button>
            </div>

            {/* CONTENT */}
            {openPeople && (
              <div className="space-y-4">
                {organization.leads?.length > 0 ? (
                  organization.leads.map((lead) => (
                    <div
                      key={lead._id}
                      className=" p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2 text-blue-500 text-sm font-medium mb-4">
                        <CiUser /> {lead.name}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/app/leads/${lead._id}`)}
                          className="border rounded-lg cursor-pointer p-1 font-bold border-gray-300 text-[11px] hover:bg-gray-100"
                        >
                          View Details
                        </button>
                        {/* <button
                          onClick={() => handleRemoveLead(lead._id)}
                          className=" px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </button> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No linked people</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {/* <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow p-5 mb-6">
            <div className="flex gap-6 border-b pb-3 mb-4 text-gray-600 text-sm font-medium">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
                Activity
              </button>

              <button className="hover:text-blue-600 transition">Notes</button>

              <button className="hover:text-blue-600 transition">Email</button>

              <button className="hover:text-blue-600 transition">Files</button>
            </div>

            <div className="border rounded-xl p-4 text-gray-400 min-h-[120px] flex items-center justify-center">
              No activity yet
            </div>
          </div>
        </div> */}
        <RightPanel
  type="organization"
  data={organization}
  setData={setOrganization}
/>
      </div>

      {/* MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl shadow-xl p-5">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Link Person</h2>
              <button onClick={() => setShowLeadModal(false)}>×</button>
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="max-h-[250px] overflow-y-auto space-y-2">
              {filteredLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => setSelectedLead(lead._id)}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedLead === lead._id && "bg-blue-50 border-blue-500"
                  }`}
                >
                  {lead.name}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddLead}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Link Person
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
