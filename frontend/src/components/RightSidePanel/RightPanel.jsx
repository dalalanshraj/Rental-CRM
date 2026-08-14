import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import ActivityComposer from "../activity/ActivityComposer";

import { Editor } from "@tinymce/tinymce-react";

import {
  Activity,
  StickyNote,
  Clock3,
  UserRound,
  MoreVertical,
  Pencil,
  Trash2,
  Pin,
  CheckCircle2,
  Circle,
  X,
  Save,
  CalendarDays,
  Phone,
  Mail,
  Users,
  ListTodo,
  AlertCircle,
} from "lucide-react";
import { MdOutlineContactPage } from "react-icons/md";

import { AnimatePresence, motion } from "framer-motion";


// ============================================================
// RIGHT PANEL
// ============================================================

export default function RightPanel({
  type,
  data,
  setData,
}) {

  // ==========================================================
  // TOP TAB
  // ==========================================================

  const [activeTab, setActiveTab] = useState("activity");
const [historyOpen, setHistoryOpen] = useState(true);
  // ==========================================================
  // HISTORY FILTER
  // ==========================================================

  const [historyFilter, setHistoryFilter] = useState("all");

  // ==========================================================
  // DATA
  // ==========================================================

  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);

  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ==========================================================
  // COMPOSERS
  // ==========================================================

  const [showNoteComposer, setShowNoteComposer] =
    useState(false);

  const [showActivityComposer, setShowActivityComposer] =
    useState(false);

  const [savingNote, setSavingNote] =
    useState(false);

  // ==========================================================
  // NOTE EDIT
  // ==========================================================

  const [editingNoteId, setEditingNoteId] =
    useState(null);

  const [editNoteText, setEditNoteText] =
    useState("");

  const [noteMenuOpen, setNoteMenuOpen] =
    useState(null);

  // ==========================================================
  // ACTIVITY EDIT
  // ==========================================================

  const [editingActivity, setEditingActivity] =
    useState(null);

  const [activityMenuOpen, setActivityMenuOpen] =
    useState(null);

  const [activityActionLoading, setActivityActionLoading] =
    useState(null);

  // ==========================================================
  // NEW NOTE
  // ==========================================================

  const [noteText, setNoteText] =
    useState("");

  // ==========================================================
  // FETCH ALL
  // ==========================================================

  useEffect(() => {

    if (!data?._id) return;

    fetchNotes();
    fetchActivities();

  }, [data?._id, type]);


  // ==========================================================
  // FETCH NOTES
  // ==========================================================

  const fetchNotes = async () => {

    try {

      setLoadingNotes(true);

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

    } catch (error) {

      console.error(
        "Failed to fetch notes:",
        error
      );

    } finally {

      setLoadingNotes(false);

    }
  };


  // ==========================================================
  // FETCH ACTIVITIES
  // ==========================================================

  const fetchActivities = async () => {

    try {

      setLoadingActivities(true);

      let url = "/activities?";

      if (type === "lead") {

        url += `leadId=${data._id}`;

      } else {

        url += `organizationId=${data._id}`;

      }

      const res = await api.get(url);

      setActivities(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "Fetch activities error:",
        error
      );

    } finally {

      setLoadingActivities(false);

    }
  };


  // ==========================================================
  // OPEN TOP TAB
  // ==========================================================

  const handleTopTab = (tab) => {

    setActiveTab(tab);

    if (tab === "notes") {

      setShowActivityComposer(false);
      setEditingActivity(null);

      setShowNoteComposer(true);

    }

    if (tab === "activity") {

      setShowNoteComposer(false);
      setEditingNoteId(null);

      setShowActivityComposer(true);

    }

  };


  // ==========================================================
  // ADD NOTE
  // ==========================================================

  const handleAddNote = async () => {

    if (!noteText.trim() || savingNote) {
      return;
    }

    try {

      setSavingNote(true);

      await api.post("/notes", {

        text: noteText,

        lead:
          type === "lead"
            ? data._id
            : null,

        organization:
          type === "organization"
            ? data._id
            : data?.organization?._id || null,

      });

      setNoteText("");

      await fetchNotes();

      setShowNoteComposer(false);

    } catch (error) {

      console.error(
        "Failed to add note:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to add note."
      );

    } finally {

      setSavingNote(false);

    }
  };


  // ==========================================================
  // CANCEL NOTE
  // ==========================================================

  const cancelNote = () => {

    setNoteText("");

    setShowNoteComposer(false);

  };


  // ==========================================================
  // EDIT NOTE
  // ==========================================================

  const handleEditNote = (note) => {

    setEditingNoteId(note._id);

    setEditNoteText(note.text || "");

    setNoteMenuOpen(null);

  };


  // ==========================================================
  // UPDATE NOTE
  // ==========================================================

  const handleUpdateNote = async () => {

    if (!editNoteText.trim()) {
      return;
    }

    try {

      const res = await api.put(
        `/notes/${editingNoteId}`,
        {
          text: editNoteText,
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
      setEditNoteText("");

    } catch (error) {

      console.error(
        "Failed to update note:",
        error
      );

    }
  };


  // ==========================================================
  // DELETE NOTE
  // ==========================================================

  const handleDeleteNote = async (noteId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {

      await api.delete(
        `/notes/${noteId}`
      );

      setNotes((prev) =>
        prev.filter(
          (item) => item._id !== noteId
        )
      );

      setNoteMenuOpen(null);

    } catch (error) {

      console.error(
        "Failed to delete note:",
        error
      );

    }
  };


  // ==========================================================
  // PIN NOTE
  // ==========================================================

  const handlePinNote = async (noteId) => {

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

      setNoteMenuOpen(null);

    } catch (error) {

      console.error(
        "Failed to pin note:",
        error
      );

    }
  };


  // ==========================================================
  // CREATE ACTIVITY
  // ==========================================================

  const handleCreateActivity = async (
    activityData
  ) => {

    try {

      const body = {

        ...activityData,

        lead:
          type === "lead"
            ? data?._id
            : null,

        organization:
          type === "organization"
            ? data?._id
            : data?.organization?._id || null,

      };

      const res = await api.post(
        "/activities",
        body
      );

      setActivities((prev) => [
        res.data,
        ...prev,
      ]);

      setShowActivityComposer(false);

      await fetchActivities();

    } catch (error) {

      console.error(
        "Create activity error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to create activity."
      );

      throw error;
    }
  };


  // ==========================================================
  // UPDATE ACTIVITY
  // ==========================================================

  const handleUpdateActivity = async (
    activityData
  ) => {

    if (!editingActivity?._id) {
      return;
    }

    try {

      const body = {

        ...activityData,

        lead:
          type === "lead"
            ? data?._id
            : null,

        organization:
          type === "organization"
            ? data?._id
            : data?.organization?._id || null,

      };

      const res = await api.put(
        `/activities/${editingActivity._id}`,
        body
      );

      setActivities((prev) =>
        prev.map((item) =>
          item._id === editingActivity._id
            ? res.data
            : item
        )
      );

      setEditingActivity(null);

      setShowActivityComposer(false);

      await fetchActivities();

    } catch (error) {

      console.error(
        "Update activity error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to update activity."
      );

      throw error;
    }
  };


  // ==========================================================
  // DELETE ACTIVITY
  // ==========================================================

  const handleDeleteActivity = async (
    activityId
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    try {

      setActivityActionLoading(activityId);

      await api.delete(
        `/activities/${activityId}`
      );

      setActivities((prev) =>
        prev.filter(
          (item) =>
            item._id !== activityId
        )
      );

      setActivityMenuOpen(null);

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete activity."
      );

    } finally {

      setActivityActionLoading(null);

    }
  };


  // ==========================================================
  // COMPLETE ACTIVITY
  // ==========================================================

  const handleCompleteActivity = async (
    activityId
  ) => {

    try {

      setActivityActionLoading(activityId);

      const res = await api.patch(
        `/activities/${activityId}/complete`
      );

      setActivities((prev) =>
        prev.map((item) =>
          item._id === activityId
            ? res.data
            : item
        )
      );

      setActivityMenuOpen(null);

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to update activity."
      );

    } finally {

      setActivityActionLoading(null);

    }
  };


  // ==========================================================
  // EDIT ACTIVITY
  // ==========================================================

  const handleEditActivity = (
    activity
  ) => {

    setEditingActivity(activity);

    setActivityMenuOpen(null);

    setActiveTab("activity");

    setShowNoteComposer(false);

    setShowActivityComposer(true);

  };


  // ==========================================================
  // CANCEL ACTIVITY
  // ==========================================================

  const cancelActivity = () => {

    setEditingActivity(null);

    setShowActivityComposer(false);

  };


  // ==========================================================
  // COMBINED HISTORY
  // ==========================================================

  const combinedHistory = useMemo(() => {

    const noteItems = notes.map((note) => ({
      ...note,
      historyType: "note",
      historyDate:
        note.createdAt ||
        note.updatedAt,
    }));

    const activityItems =
      activities.map((activity) => ({
        ...activity,
        historyType: "activity",
        historyDate:
          activity.createdAt ||
          activity.dueDate,
      }));

    return [
      ...noteItems,
      ...activityItems,
    ].sort(
      (a, b) =>
        new Date(b.historyDate || 0) -
        new Date(a.historyDate || 0)
    );

  }, [notes, activities]);


  // ==========================================================
  // FILTERED HISTORY
  // ==========================================================

  const filteredHistory = useMemo(() => {

    if (historyFilter === "notes") {

      return combinedHistory.filter(
        (item) =>
          item.historyType === "note"
      );

    }

    if (historyFilter === "activities") {

      return combinedHistory.filter(
        (item) =>
          item.historyType === "activity"
      );

    }

    return combinedHistory;

  }, [
    combinedHistory,
    historyFilter,
  ]);


  // ==========================================================
  // DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) return "-";

    const d = new Date(date);

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const target = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );

    const diff = Math.round(
      (target - today) /
      (1000 * 60 * 60 * 24)
    );

    if (diff === 0) {

      return `Today at ${d.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;

    }

    if (diff === -1) {

      return `Yesterday at ${d.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;

    }

    return d.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  // ==========================================================
  // ACTIVITY ICON
  // ==========================================================

  const getActivityIcon = (
    activityType
  ) => {

    switch (activityType) {

      case "call":
        return <Phone size={19} />;

      case "email":
        return <Mail size={19} />;

      case "meeting":
        return <Users size={19} />;

      case "deadline":
        return (
          <AlertCircle size={19} />
        );

      default:
        return <ListTodo size={19} />;

    }

  };


  // ==========================================================
  // ACTIVITY ICON STYLE
  // ==========================================================

  const getActivityStyle = (
    activityType
  ) => {

    switch (activityType) {

      case "call":
        return "bg-blue-50 text-blue-600";

      case "email":
        return "bg-emerald-50 text-emerald-600";

      case "meeting":
        return "bg-purple-50 text-purple-600";

      case "deadline":
        return "bg-red-50 text-red-600";

      default:
        return "bg-orange-50 text-orange-600";

    }

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  const loading =
    loadingNotes ||
    loadingActivities;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="w-full p-5 lg:p-6">

      <div
        className="
          w-full
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_8px_35px_rgba(15,23,42,0.06)]
          overflow-visible
        "
      >

        {/* ==================================================
            TOP ACTION TABS
        ================================================== */}

        <div
          className="
            flex
            items-center
            border-b
            border-gray-200
            overflow-x-auto
            scrollbar-none
          "
        >

          {/* ACTIVITY */}

          <button
            type="button"
            onClick={() =>
              handleTopTab("activity")
            }
            className={`
              relative
              flex
              items-center
              gap-2.5
              px-6
              h-14
              text-sm
              font-medium
              whitespace-nowrap
              transition
              ${
                activeTab === "activity"
                  ? `
                    text-[#2563eb]
                    bg-blue-50/70
                  `
                  : `
                    text-gray-500
                    hover:text-gray-800
                    hover:bg-gray-50
                  `
              }
            `}
          >

            <Activity size={19} />

            Activity

            {activeTab === "activity" && (
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  h-[2px]
                  bg-blue-600
                "
              />
            )}

          </button>


          {/* NOTES */}

          <button
            type="button"
            onClick={() =>
              handleTopTab("notes")
            }
            className={`
              relative
              flex
              items-center
              gap-2.5
              px-6
              h-14
              text-sm
              font-medium
              whitespace-nowrap
              transition
              ${
                activeTab === "notes"
                  ? `
                    text-[#4B49AC]
                    bg-indigo-50/60
                  `
                  : `
                    text-gray-500
                    hover:text-gray-800
                    hover:bg-gray-50
                  `
              }
            `}
          >

            <StickyNote size={19} />

            Notes

            {activeTab === "notes" && (
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  h-[2px]
                  bg-[#4B49AC]
                "
              />
            )}

          </button>

        </div>


        {/* ==================================================
            COLLAPSED COMPOSER AREA
        ================================================== */}

        <div
          className="
            border-b
            border-gray-100
            bg-white
          "
        >

          {/* -----------------------------------------------
              ACTIVITY COLLAPSED
          ----------------------------------------------- */}

          {activeTab === "activity" &&
            !showActivityComposer && (
              <button
                type="button"
                onClick={() =>
                  setShowActivityComposer(true)
                }
                className="
                  w-full
                  text-left
                  px-7
                  py-6
                  text-gray-400
                  text-sm
                  hover:text-blue-600
                  hover:bg-gray-50
                  transition
                "
              >
                Click here to add an activity...
              </button>
            )}


          {/* -----------------------------------------------
              ACTIVITY COMPOSER
          ----------------------------------------------- */}

          <AnimatePresence>
            {activeTab === "activity" &&
              showActivityComposer && (

                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >

                  <div className="p-5">

                    <ActivityComposer
                      type={type}
                      data={data}
                      editingActivity={
                        editingActivity
                      }
                      onSave={
                        editingActivity
                          ? handleUpdateActivity
                          : handleCreateActivity
                      }
                      onCancel={
                        cancelActivity
                      }
                    />

                  </div>

                </motion.div>

              )}
          </AnimatePresence>


          {/* -----------------------------------------------
              NOTE COLLAPSED
          ----------------------------------------------- */}

          {activeTab === "notes" &&
            !showNoteComposer && (

              <button
                type="button"
                onClick={() =>
                  setShowNoteComposer(true)
                }
                className="
                  w-full
                  text-left
                  px-7
                  py-6
                  text-gray-400
                  text-sm
                  hover:text-[#4B49AC]
                  hover:bg-gray-50
                  transition
                "
              >
                Click here to add a note...
              </button>

            )}


          {/* -----------------------------------------------
              NOTE COMPOSER
          ----------------------------------------------- */}

          <AnimatePresence>

            {activeTab === "notes" &&
              showNoteComposer && (

                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >

                  <div
                    className="
                      p-5
                      bg-indigo-50/20
                    "
                  >

                    <div
                      className="
                        border
                        border-indigo-100
                        rounded-2xl
                        overflow-hidden
                        bg-white
                        shadow-sm
                      "
                    >

                      {/* NOTE HEADER */}

                      {/* <div
                        className="
                          px-5
                          py-4
                          flex
                          items-center
                          justify-between
                          border-b
                          border-gray-100
                        "
                      >

                  

                      </div> */}


                      {/* EDITOR */}

                      <div className="p-4">
      <div
                          className="
                            flex
                            items-center
                            gap-3 
                            mt-2
                            mb-3
                          "
                        >

                          <div
                            className="
                              w-9
                              h-9
                             
                              text-[#000]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <MdOutlineContactPage 
                              size={25}
                            />
                          </div>

                          <div>

                            <h3
                              className="
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              Add a note
                            </h3>

                            <p
                              className="
                                text-[11px]
                                text-gray-400
                              "
                            >
                              Add an internal note
                              to this record
                            </p>

                          </div>

                        </div>
                        <div
                          className="
                            rounded-xl
                            overflow-hidden
                            border
                            border-gray-200
                          "
                        >

                          <Editor
                            value={noteText}
                            onEditorChange={(content) =>
                              setNoteText(content)
                            }
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
                                  font-size: 14px;
                                  line-height: 1.6;
                                  padding: 8px 12px;
                                }
                              `,
                            }}
                          />

                        </div>


                        {/* BUTTONS */}

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
                            onClick={cancelNote}
                            disabled={savingNote}
                            className="
                              h-9
                              px-4
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
                            "
                          >

                            <X size={14} />

                            Cancel

                          </button>


                          <button
                            type="button"
                            onClick={handleAddNote}
                            disabled={
                              !noteText.trim() ||
                              savingNote
                            }
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
                              hover:bg-indigo-700
                              disabled:opacity-40
                            "
                          >

                            {savingNote ? (
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

                            {savingNote
                              ? "Saving..."
                              : "Save Note"}

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </motion.div>

              )}

          </AnimatePresence>

        </div>


        {/* ==================================================
            FOCUS
        ================================================== */}

        {/* <div
          className="
            px-6
            pt-7
            pb-3
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h3
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Focus
              </h3>

              <span className="text-gray-400">
                ↓
              </span>

            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  w-9
                  h-5
                  rounded-full
                  bg-gray-200
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-0.5
                    top-0.5
                    w-4
                    h-4
                    bg-white
                    rounded-full
                    shadow-sm
                  "
                />

              </span>

              <span
                className="
                  text-sm
                  text-gray-500
                "
              >
                Expand all items
              </span>

            </div>

          </div>


          <div
            className="
              py-8
              text-center
            "
          >

            <p
              className="
                text-base
                font-medium
                text-gray-700
              "
            >
              No focus items yet
            </p>

            <p
              className="
                text-sm
                text-gray-400
                mt-2
              "
            >
              Scheduled activities and
              pinned notes will appear here.
            </p>

          </div>

        </div> */}


        {/* ==================================================
            HISTORY
        ================================================== */}

        <div
          className="
            px-6
            pb-8
          "
        >

          {/* HISTORY TITLE */}

          <div
            className="
              flex
              items-center
              gap-2
              mb-5
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                text-gray-800 
                mt-5
              "
            >
              History
            </h2>

            {/* <span className="text-gray-400   mt-5">
              ↓
            </span> */}

          </div>


          {/* HISTORY FILTERS */}

          <div
            className="
              flex
              items-center
              gap-2
              overflow-x-auto
              pb-3
              scrollbar-none
            "
          >

            <HistoryButton
              active={
                historyFilter === "all"
              }
              onClick={() =>
                setHistoryFilter("all")
              }
            >
              All
            </HistoryButton>


            <HistoryButton
              active={
                historyFilter === "activities"
              }
              onClick={() =>
                setHistoryFilter(
                  "activities"
                )
              }
            >
              Activities ({activities.length})
            </HistoryButton>


            <HistoryButton
              active={
                historyFilter === "notes"
              }
              onClick={() =>
                setHistoryFilter("notes")
              }
            >
              Notes ({notes.length})
            </HistoryButton>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="space-y-4 mt-4">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="
                    h-32
                    rounded-2xl
                    bg-gray-100
                    animate-pulse
                  "
                />

              ))}

            </div>

          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            filteredHistory.length === 0 && (

              <div
                className="
                  py-16
                  text-center
                  border
                  border-dashed
                  border-gray-200
                  rounded-2xl
                  bg-gray-50/50
                "
              >

                <div
                  className="
                    w-14
                    h-14
                    mx-auto
                    rounded-full
                    bg-white
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-400
                  "
                >

                  <Clock3 size={25} />

                </div>

                <h3
                  className="
                    mt-4
                    font-semibold
                    text-gray-700
                  "
                >
                  No history yet
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-400
                  "
                >
                  Notes and activities will
                  appear here.
                </p>

              </div>

            )}


          {/* =================================================
              TIMELINE
          ================================================= */}

          {!loading &&
            filteredHistory.length > 0 && (

              <div
                className="
                  relative
                  mt-5
                "
              >

                {/* VERTICAL LINE */}

                <div
                  className="
                    absolute
                    left-[24px]
                    top-5
                    bottom-5
                    w-px
                    bg-gray-200
                  "
                />


                <div className="space-y-5">

                  {filteredHistory.map(
                    (item) => (

                      <TimelineItem
                        key={`${item.historyType}-${item._id}`}
                        item={item}
                        formatDate={
                          formatDate
                        }
                        getActivityIcon={
                          getActivityIcon
                        }
                        getActivityStyle={
                          getActivityStyle
                        }
                        editingNoteId={
                          editingNoteId
                        }
                        editNoteText={
                          editNoteText
                        }
                        setEditNoteText={
                          setEditNoteText
                        }
                        handleUpdateNote={
                          handleUpdateNote
                        }
                        noteMenuOpen={
                          noteMenuOpen
                        }
                        setNoteMenuOpen={
                          setNoteMenuOpen
                        }
                        handleEditNote={
                          handleEditNote
                        }
                        handlePinNote={
                          handlePinNote
                        }
                        handleDeleteNote={
                          handleDeleteNote
                        }
                        activityMenuOpen={
                          activityMenuOpen
                        }
                        setActivityMenuOpen={
                          setActivityMenuOpen
                        }
                        handleEditActivity={
                          handleEditActivity
                        }
                        handleCompleteActivity={
                          handleCompleteActivity
                        }
                        handleDeleteActivity={
                          handleDeleteActivity
                        }
                        activityActionLoading={
                          activityActionLoading
                        }
                      />

                    )
                  )}

                </div>

              </div>

            )}

        </div>

      </div>

    </div>

  );
}


// ============================================================
// HISTORY BUTTON
// ============================================================

function HistoryButton({
  active,
  onClick,
  children,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        whitespace-nowrap
        px-3.5
        py-2
        rounded-xl
        text-sm
        font-medium
        transition
        ${
          active
            ? `
              bg-blue-50
              text-blue-600
            `
            : `
              text-gray-500
              hover:bg-gray-50
              hover:text-gray-800
            `
        }
      `}
    >

      {children}

    </button>

  );

}


// ============================================================
// TIMELINE ITEM
// ============================================================

function TimelineItem({
  item,
  formatDate,
  getActivityIcon,
  getActivityStyle,

  editingNoteId,
  editNoteText,
  setEditNoteText,
  handleUpdateNote,

  noteMenuOpen,
  setNoteMenuOpen,
  handleEditNote,
  handlePinNote,
  handleDeleteNote,

  activityMenuOpen,
  setActivityMenuOpen,
  handleEditActivity,
  handleCompleteActivity,
  handleDeleteActivity,

  activityActionLoading,
}) {

  const isNote =
    item.historyType === "note";


  // ==========================================================
  // NOTE
  // ==========================================================

  if (isNote) {

    return (

      <motion.div
        layout
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          pl-14
        "
      >

        {/* ICON */}

        <div
          className="
            absolute
            left-0
            top-1
            w-12
            h-12
            rounded-full
            bg-white
            border
            border-gray-200
            shadow-sm
            flex
            items-center
            justify-center
            z-10
            text-[#4B49AC]
          "
        >

          <StickyNote size={19} />

        </div>


        {/* CARD */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            hover:shadow-md
            transition
            overflow-visible
          "
        >

          {/* HEADER */}

          <div
            className="
              px-5
              pt-4
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

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
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  {item.createdBy?.name ||
                    "Unknown User"}
                </span>


                {item.pinned && (

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      px-2
                      py-0.5
                      rounded-full
                      bg-amber-50
                      text-amber-600
                      text-[10px]
                      font-semibold
                    "
                  >

                    <Pin size={10} />

                    Pinned

                  </span>

                )}

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  mt-1
                  text-xs
                  text-gray-400
                "
              >

                <Clock3 size={11} />

                {formatDate(
                  item.createdAt
                )}

              </div>

            </div>


            {/* MENU */}

            <div className="relative">

              <button
                type="button"
                onClick={(e) => {

                  e.stopPropagation();

                  setNoteMenuOpen(
                    noteMenuOpen === item._id
                      ? null
                      : item._id
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
                  hover:bg-gray-100
                "
              >

                <MoreVertical
                  size={17}
                />

              </button>


              {noteMenuOpen === item._id && (

                <div
                  className="
                    absolute
                    right-0
                    top-9
                    w-40
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-xl
                    z-50
                    overflow-hidden
                    p-1
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleEditNote(item)
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-gray-600
                      hover:bg-indigo-50
                      hover:text-[#4B49AC]
                    "
                  >

                    <Pencil size={14} />

                    Edit note

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handlePinNote(
                        item._id
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-gray-600
                      hover:bg-amber-50
                    "
                  >

                    <Pin size={14} />

                    {item.pinned
                      ? "Unpin"
                      : "Pin"}

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteNote(
                        item._id
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-red-600
                      hover:bg-red-50
                    "
                  >

                    <Trash2 size={14} />

                    Delete

                  </button>

                </div>

              )}

            </div>

          </div>


          {/* NOTE BODY */}

          <div className="px-5 pb-5 pt-4">

            {editingNoteId === item._id ? (

              <div>

                <textarea
                  value={editNoteText}
                  onChange={(e) =>
                    setEditNoteText(
                      e.target.value
                    )
                  }
                  rows={5}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    p-3
                    text-sm
                    outline-none
                    focus:border-[#4B49AC]
                    focus:ring-4
                    focus:ring-indigo-500/10
                    resize-none
                  "
                />


                <div
                  className="
                    flex
                    justify-end
                    gap-2
                    mt-2
                  "
                >

                  <button
                    type="button"
                    onClick={() => {
                      setEditNoteText("");
                    }}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      text-xs
                      text-gray-500
                      hover:bg-gray-100
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    onClick={
                      handleUpdateNote
                    }
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-[#4B49AC]
                      text-white
                      text-xs
                      font-medium
                    "
                  >

                    Save

                  </button>

                </div>

              </div>

            ) : (

              <div
                className="
                  text-sm
                  text-gray-700
                  leading-6
                  prose
                  prose-sm
                  max-w-none
                "
                dangerouslySetInnerHTML={{
                  __html:
                    item.text ||
                    "<span>No content</span>",
                }}
              />

            )}

          </div>

        </div>

      </motion.div>

    );

  }


  // ==========================================================
  // ACTIVITY
  // ==========================================================

  return (

    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        pl-14
      "
    >

      {/* ICON */}

      <div
        className={`
          absolute
          left-0
          top-1
          w-12
          h-12
          rounded-full
          border
          border-gray-200
          shadow-sm
          flex
          items-center
          justify-center
          z-10
          ${getActivityStyle(item.type)}
        `}
      >

        {getActivityIcon(item.type)}

      </div>


      {/* CARD */}

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-sm
          hover:shadow-md
          transition
        "
      >

        <div className="p-5">

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div className="min-w-0">

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <h3
                  className={`
                    text-base
                    sm:text-lg
                    font-semibold
                    truncate
                    ${
                      item.status ===
                      "completed"
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }
                  `}
                >
                  {item.title}
                </h3>


                {item.status ===
                  "completed" && (

                  <CheckCircle2
                    size={18}
                    className="
                      text-emerald-500
                      flex-shrink-0
                    "
                  />

                )}

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-1.5
                  text-xs
                  sm:text-sm
                  text-gray-400
                "
              >

                <CalendarDays
                  size={13}
                />

                {formatDate(
                  item.dueDate
                )}

                {item.startTime && (
                  <>
                    <span>•</span>

                    <span>
                      {formatTime(
                        item.startTime
                      )}
                    </span>
                  </>
                )}

              </div>

            </div>


            {/* ACTIVITY MENU */}

            <div className="relative flex-shrink-0">

              <button
                type="button"
                onClick={() =>
                  setActivityMenuOpen(
                    activityMenuOpen ===
                      item._id
                      ? null
                      : item._id
                  )
                }
                disabled={
                  activityActionLoading ===
                  item._id
                }
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:bg-gray-100
                "
              >

                <MoreVertical
                  size={17}
                />

              </button>


              {activityMenuOpen ===
                item._id && (

                <div
                  className="
                    absolute
                    right-0
                    top-9
                    w-44
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-xl
                    z-50
                    overflow-hidden
                    p-1
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleEditActivity(
                        item
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-gray-600
                      hover:bg-gray-50
                    "
                  >

                    <Pencil size={14} />

                    Edit

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteActivity(
                        item._id
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-gray-600
                      hover:bg-gray-50
                    "
                  >

                    {item.status ===
                    "completed" ? (
                      <Circle size={14} />
                    ) : (
                      <CheckCircle2
                        size={14}
                        className="
                          text-emerald-500
                        "
                      />
                    )}

                    {item.status ===
                    "completed"
                      ? "Mark Pending"
                      : "Mark Complete"}

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteActivity(
                        item._id
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2.5
                      text-sm
                      text-red-600
                      hover:bg-red-50
                    "
                  >

                    <Trash2 size={14} />

                    Delete

                  </button>

                </div>

              )}

            </div>

          </div>


          {/* DESCRIPTION */}

          {item.description && (

            <div
              className="
                mt-4
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-3
                text-sm
                text-gray-600
                leading-6
              "
            >

              {item.description}

            </div>

          )}


          {/* ACTIVITY NOTE */}

          {item.note && (

            <div
              className="
                mt-3
                rounded-xl
                border
                border-yellow-200
                bg-yellow-50
                p-3
                text-sm
                text-gray-600
                leading-6
              "
            >

              {item.note}

            </div>

          )}


          {/* CREATED BY */}

          <div
            className="
              flex
              items-center
              gap-2
              mt-4
              pt-3
              border-t
              border-gray-100
              text-xs
              text-gray-400
            "
          >

            <UserRound
              size={13}
            />

            {item.createdBy?.name ||
              item.owner?.name ||
              dataOwner(item) ||
              "User"}

          </div>

        </div>

      </div>

    </motion.div>

  );

}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(time) {

  if (!time) return "";

  const [hours, minutes] =
    time.split(":");

  const d = new Date();

  d.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return d.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

}


// ============================================================
// FALLBACK OWNER
// ============================================================

function dataOwner(item) {

  if (
    typeof item.owner === "string"
  ) {
    return "";
  }

  return (
    item.owner?.name ||
    ""
  );

}