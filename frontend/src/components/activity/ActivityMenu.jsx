import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";

import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function ActivityMenu({
  activity,
  onUpdated,
  onDeleted,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  // ==========================
  // Complete
  // ==========================

  const handleComplete = async () => {
    try {

      const res = await api.patch(
        `/activities/${activity._id}/complete`
      );

      onUpdated(res.data);

      setOpen(false);

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async () => {
    try {

      await api.delete(
        `/activities/${activity._id}`
      );

      onDeleted(activity._id);

      setOpen(false);

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >

      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <BsThreeDotsVertical />
      </button>

      {open && (

        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border z-50">

          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            onClick={() => {

              // Next Step

              console.log("Edit");

            }}
          >
            <BiEdit />

            Edit

          </button>

          <button
            onClick={handleComplete}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <FaCheckCircle />

            {activity.status === "completed"
              ? "Mark Pending"
              : "Mark Complete"}

          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <MdOutlineDeleteOutline />

            Delete

          </button>

        </div>

      )}

    </div>
  );
}