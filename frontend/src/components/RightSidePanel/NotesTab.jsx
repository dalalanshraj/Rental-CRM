import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  StickyNote,
  Save,
  X,
  MoreVertical,
  Pencil,
  Pin,
  Trash2,
  UserRound,
  Clock3,
  CheckCircle2,
  PinIcon,
} from "lucide-react";

const TINYMCE_API_KEY =
  "2r6x758dp6es0ii45zfw9xu5fy23suwa6g8qxoakazk9tywz";

export default function NotesTab({ type, data }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  const [menuOpen, setMenuOpen] = useState(null);

  const [editingNoteId, setEditingNoteId] =
    useState(null);

  const [editText, setEditText] = useState("");

  const [saving, setSaving] = useState(false);

  /* =====================================
      FETCH NOTES
  ====================================== */

  useEffect(() => {
    if (data?._id) {
      fetchNotes();
    }
  }, [data?._id, type]);

  /* =====================================
      CLOSE MENU
  ====================================== */

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(null);
    };

    window.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      window.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================
      FORMAT DATE
  ====================================== */

  const formatNoteDate = (createdAt) => {
    if (!createdAt) return "";

    const noteDate = new Date(createdAt);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfNoteDay = new Date(
      noteDate.getFullYear(),
      noteDate.getMonth(),
      noteDate.getDate()
    );

    const diffDays = Math.floor(
      (startOfToday - startOfNoteDay) /
        (1000 * 60 * 60 * 24)
    );

    const time =
      noteDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

    if (diffDays === 0) {
      return `Today at ${time}`;
    }

    if (diffDays === 1) {
      return `Yesterday at ${time}`;
    }

    if (diffDays > 1 && diffDays < 7) {
      const weekday =
        noteDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

      return `Last ${weekday} at ${time}`;
    }

    const formattedDate =
      noteDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          noteDate.getFullYear() !==
          now.getFullYear()
            ? "numeric"
            : undefined,
      });

    return `${formattedDate} at ${time}`;
  };

  /* =====================================
      FETCH
  ====================================== */

  const fetchNotes = async () => {
    try {
      let url = "/notes?";

      if (type === "lead") {
        url += `lead=${data._id}`;
      } else {
        url += `organization=${data._id}`;
      }

      const res = await api.get(url);

      setNotes(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch notes:",
        err
      );
    }
  };

  /* =====================================
      ADD NOTE
  ====================================== */

  const handleAddNote = async () => {
    if (!note.trim() || saving) return;

    try {
      setSaving(true);

      await api.post("/notes", {
        text: note,

        lead:
          type === "lead"
            ? data._id
            : null,

        organization:
          type === "organization"
            ? data._id
            : data.organization?._id || null,
      });

      setNote("");

      await fetchNotes();
    } catch (err) {
      console.error(
        "Failed to add note:",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================
      CANCEL NEW NOTE
  ====================================== */

  const handleCancel = () => {
    setNote("");
  };

  /* =====================================
      EDIT
  ====================================== */

  const handleEdit = (item) => {
    setEditingNoteId(item._id);
    setEditText(item.text);
    setMenuOpen(null);
  };

  /* =====================================
      UPDATE
  ====================================== */

  const handleUpdate = async () => {
    if (!editText.trim() || saving) return;

    try {
      setSaving(true);

      const res = await api.put(
        `/notes/${editingNoteId}`,
        {
          text: editText,
        }
      );

      setNotes((prev) =>
        prev.map((item) =>
          item._id === editingNoteId
            ? res.data
            : item
        )
      );

      setEditingNoteId(null);
      setEditText("");

      await fetchNotes();
    } catch (err) {
      console.error(
        "Failed to update note:",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================
      DELETE
  ====================================== */

  const handleDelete = async (noteId) => {
    try {
      await api.delete(
        `/notes/${noteId}`
      );

      setNotes((prev) =>
        prev.filter(
          (item) => item._id !== noteId
        )
      );

      setMenuOpen(null);
    } catch (err) {
      console.error(
        "Failed to delete note:",
        err
      );
    }
  };

  /* =====================================
      PIN
  ====================================== */

  const handlePin = async (noteId) => {
    try {
      const res = await api.patch(
        `/notes/${noteId}/pin`
      );

      setNotes((prev) =>
        prev.map((item) =>
          item._id === noteId
            ? res.data
            : item
        )
      );

      setMenuOpen(null);
    } catch (err) {
      console.error(
        "Failed to pin note:",
        err
      );
    }
  };

  /* =====================================
      SORT NOTES
  ====================================== */

  const sortedNotes = [...notes].sort(
    (a, b) => {
      if (a.pinned !== b.pinned) {
        return b.pinned - a.pinned;
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }
  );

  return (
    <div className="w-full">

      {/* =====================================
          CREATE NOTE
      ====================================== */}

      <div
        className="
          rounded-2xl
          border
          border-indigo-100
          bg-gradient-to-br
          from-indigo-50/70
          via-white
          to-violet-50/50
          p-4
          shadow-sm
          mb-7
        "
      >

        {/* EDITOR HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-indigo-100
                text-[#4B49AC]
                flex
                items-center
                justify-center
              "
            >
              <StickyNote size={18} />
            </div>

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-gray-800
                "
              >
                Add a note
              </h3>

              <p
                className="
                  text-[11px]
                  text-gray-400
                  mt-0.5
                "
              >
                Add an internal note to
                this record
              </p>

            </div>

          </div>

          {note && (
            <span
              className="
                text-[11px]
                font-medium
                text-indigo-500
                bg-indigo-50
                px-2.5
                py-1
                rounded-full
              "
            >
              Draft
            </span>
          )}

        </div>

        {/* EDITOR */}

        <div
          className="
            rounded-xl
            overflow-hidden
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <Editor
  value={note}
  onEditorChange={(content) => setNote(content)}
  tinymceScriptSrc="/tinymce/tinymce.min.js"
  licenseKey="gpl"
  init={{
    height: 170,
    menubar: false,

    plugins: [
      "link",
      "lists",
    ],

    toolbar:
      "bold italic underline | bullist numlist | link",

    branding: false,

    content_style: `
      body {
        font-family: Inter, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        padding: 8px 12px;
      }
    `,
  }}
/>
        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            mt-3
          "
        >

          <button
            type="button"
            onClick={handleCancel}
            disabled={!note || saving}
            className="
              h-9
              px-3.5
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-500
              text-xs
              font-medium
              flex
              items-center
              gap-1.5
              hover:bg-gray-50
              hover:text-gray-700
              transition-all
              disabled:opacity-40
            "
          >
            <X size={14} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddNote}
            disabled={!note.trim() || saving}
            className="
              h-9
              px-4
              rounded-xl
              bg-[#4B49AC]
              text-white
              text-xs
              font-semibold
              flex
              items-center
              gap-1.5
              shadow-sm
              shadow-indigo-500/20
              hover:bg-indigo-700
              hover:-translate-y-[1px]
              transition-all
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            {saving ? (
              <span
                className="
                  w-3.5
                  h-3.5
                  border-2
                  border-white/40
                  border-t-white
                  rounded-full
                  animate-spin
                "
              />
            ) : (
              <Save size={14} />
            )}

            {saving
              ? "Saving..."
              : "Save Note"}
          </button>

        </div>

      </div>


      {/* =====================================
          HISTORY HEADER
      ====================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-4
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-gray-100
              text-gray-500
              flex
              items-center
              justify-center
            "
          >
            <Clock3 size={16} />
          </div>

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-gray-800
              "
            >
              Notes History
            </h3>

            <p
              className="
                text-[11px]
                text-gray-400
                mt-0.5
              "
            >
              {notes.length}{" "}
              {notes.length === 1
                ? "note"
                : "notes"}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {sortedNotes.length === 0 && (
        <div
          className="
            border
            border-dashed
            border-gray-200
            rounded-2xl
            py-12
            px-6
            text-center
            bg-gray-50/50
          "
        >

          <div
            className="
              mx-auto
              w-14
              h-14
              rounded-2xl
              bg-indigo-50
              text-indigo-500
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <StickyNote size={25} />
          </div>

          <h4
            className="
              text-sm
              font-semibold
              text-gray-700
            "
          >
            No notes yet
          </h4>

          <p
            className="
              text-xs
              text-gray-400
              mt-1
              max-w-[280px]
              mx-auto
            "
          >
            Add your first note above
            to keep important information
            about this record.
          </p>

        </div>
      )}


      {/* =====================================
          NOTES LIST
      ====================================== */}

      <div className="space-y-3">

        <AnimatePresence mode="popLayout">

          {sortedNotes.map((n) => (

            <motion.div
              key={n._id}
              layout
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.2,
              }}
              className={`
                group
                relative
                rounded-2xl
                border
                p-4
                transition-all
                duration-200
                ${
                  n.pinned
                    ? `
                      bg-amber-50/70
                      border-amber-200
                      shadow-[0_4px_20px_rgba(245,158,11,0.08)]
                    `
                    : `
                      bg-white
                      border-gray-200
                      hover:border-indigo-100
                      hover:shadow-[0_6px_25px_rgba(15,23,42,0.06)]
                    `
                }
              `}
            >

              {/* =====================================
                  NOTE HEADER
              ====================================== */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                >

                  {/* USER AVATAR */}

                  <div
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-500
                      text-white
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                      shadow-sm
                    "
                  >
                    <UserRound size={16} />
                  </div>

                  {/* USER INFO */}

                  <div className="min-w-0">

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        flex-wrap
                      "
                    >

                      <span
                        className="
                          text-xs
                          font-semibold
                          text-gray-700
                        "
                      >
                        {n.createdBy?.name ||
                          "Unknown User"}
                      </span>

                      {n.pinned && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            px-2
                            py-0.5
                            rounded-full
                            bg-amber-100
                            text-amber-700
                            text-[10px]
                            font-semibold
                          "
                        >
                          <PinIcon
                            size={10}
                          />
                          Pinned
                        </span>
                      )}

                      {n.edited && (
                        <span
                          title={
                            n.editedAt
                              ? `Edited ${new Date(
                                  n.editedAt
                                ).toLocaleString()}`
                              : "Edited"
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1
                            px-2
                            py-0.5
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            text-[10px]
                            font-semibold
                          "
                        >
                          <Pencil
                            size={10}
                          />
                          Edited
                        </span>
                      )}

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        mt-1
                        text-[11px]
                        text-gray-400
                      "
                    >
                      <Clock3 size={11} />

                      {formatNoteDate(
                        n.createdAt
                      )}
                    </div>

                  </div>

                </div>


                {/* =====================================
                    MENU
                ====================================== */}

                <div className="relative flex-shrink-0">

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      setMenuOpen(
                        menuOpen === n._id
                          ? null
                          : n._id
                      );
                    }}
                    className="
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-gray-400
                      hover:text-gray-700
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <MoreVertical
                      size={17}
                    />
                  </button>


                  {/* MENU */}

                  {menuOpen === n._id && (
                    <div
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="
                        absolute
                        right-0
                        top-9
                        w-44
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-[0_15px_40px_rgba(15,23,42,0.16)]
                        overflow-hidden
                        z-[999]
                        p-1
                      "
                    >

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(n)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          text-gray-600
                          hover:bg-indigo-50
                          hover:text-[#4B49AC]
                          transition
                          text-left
                        "
                      >
                        <Pencil size={15} />
                        Edit note
                      </button>


                      {/* PIN */}

                      <button
                        type="button"
                        onClick={() =>
                          handlePin(n._id)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          text-gray-600
                          hover:bg-amber-50
                          hover:text-amber-600
                          transition
                          text-left
                        "
                      >
                        <Pin size={15} />

                        {n.pinned
                          ? "Unpin note"
                          : "Pin note"}
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(n._id)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          text-red-500
                          hover:bg-red-50
                          transition
                          text-left
                        "
                      >
                        <Trash2 size={15} />
                        Delete note
                      </button>

                    </div>
                  )}

                </div>

              </div>


              {/* =====================================
                  NOTE BODY
              ====================================== */}

              <div className="mt-4">

                {editingNoteId === n._id ? (

                  <div>

                    <div
                      className="
                        rounded-xl
                        overflow-hidden
                        border
                        border-indigo-200
                        shadow-sm
                      "
                    >
                      <Editor
                        apiKey={TINYMCE_API_KEY}
                        value={editText}
                        onEditorChange={(
                          content
                        ) =>
                          setEditText(
                            content
                          )
                        }
                        init={{
                          height: 170,
                          menubar: false,
                          plugins: [
                            "link",
                            "lists",
                          ],
                          toolbar:
                            "bold italic underline | bullist numlist | link",
                          branding: false,
                          statusbar: false,
                          content_style: `
                            body {
                              font-family: Inter, Arial, sans-serif;
                              font-size: 14px;
                              color: #374151;
                              padding: 10px;
                              line-height: 1.6;
                            }
                          `,
                        }}
                      />
                    </div>


                    {/* EDIT ACTIONS */}

                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                        mt-3
                      "
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(
                            null
                          );
                          setEditText("");
                        }}
                        disabled={saving}
                        className="
                          h-9
                          px-3
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-gray-500
                          text-xs
                          font-medium
                          flex
                          items-center
                          gap-1.5
                          hover:bg-gray-50
                          transition
                        "
                      >
                        <X size={14} />
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleUpdate
                        }
                        disabled={
                          saving ||
                          !editText.trim()
                        }
                        className="
                          h-9
                          px-4
                          rounded-lg
                          bg-[#4B49AC]
                          text-white
                          text-xs
                          font-semibold
                          flex
                          items-center
                          gap-1.5
                          hover:bg-indigo-700
                          transition
                          disabled:opacity-40
                        "
                      >
                        {saving ? (
                          <span
                            className="
                              w-3.5
                              h-3.5
                              border-2
                              border-white/40
                              border-t-white
                              rounded-full
                              animate-spin
                            "
                          />
                        ) : (
                          <CheckCircle2
                            size={14}
                          />
                        )}

                        {saving
                          ? "Saving..."
                          : "Update Note"}
                      </button>

                    </div>

                  </div>

                ) : (

                  <div
                    className="
                      prose
                      prose-sm
                      max-w-none
                      text-gray-600
                      leading-relaxed
                      prose-a:text-[#4B49AC]
                      prose-a:no-underline
                      hover:prose-a:underline
                      prose-strong:text-gray-800
                    "
                    dangerouslySetInnerHTML={{
                      __html: n.text,
                    }}
                  />

                )}

              </div>

            </motion.div>

          ))}

        </AnimatePresence>

      </div>

    </div>
  );
}