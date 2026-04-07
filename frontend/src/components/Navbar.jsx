export default function Navbar({ onSearch, onAddLead }) {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* SEARCH */}
      <input
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search..."
        className="w-96 p-2 border rounded-full px-4"
      />

      {/* PLUS BUTTON */}
      <button
        onClick={onAddLead}
        className="w-10 h-10 bg-gray-100 rounded-full"
      >
        +
      </button>

    </div>
  );
}