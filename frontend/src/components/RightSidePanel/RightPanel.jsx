import { useState } from "react";
import {
  Activity,
  StickyNote,
  Mail,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

import NotesTab from "./NotesTab";
import ActivityTab from "../activity/ ActivityTab";

// import EmailTab from "./EmailTab";
// import FilesTab from "./FilesTab";

export default function RightPanel({
  type,
  data,
  setData,
}) {
  const [activeTab, setActiveTab] = useState("notes");

  const tabs = [
    {
      id: "notes",
      label: "Notes",
      icon: StickyNote,
      description: "Internal notes",
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      description: "Tasks & activities",
    },

    // Future tabs
    // {
    //   id: "email",
    //   label: "Email",
    //   icon: Mail,
    //   description: "Email history",
    // },
    // {
    //   id: "files",
    //   label: "Files",
    //   icon: FolderOpen,
    //   description: "Documents",
    // },
  ];

  const activeTabData = tabs.find(
    (tab) => tab.id === activeTab
  );

  return (
    <div className="w-full min-h-full p-5 lg:p-6">

      {/* =====================================
          MAIN PANEL
      ====================================== */}

      <div
        className="
          w-full
          bg-white
          rounded-3xl
          border
          border-gray-200/80
          shadow-[0_8px_35px_rgba(15,23,42,0.06)]
          overflow-visible
        "
      >

        {/* =====================================
            HEADER
        ====================================== */}

        <div
          className="
            px-5
            pt-5
            pb-4
            border-b
            border-gray-100
            bg-gradient-to-b
            from-white
            to-gray-50/60
            rounded-t-3xl
          "
        >

          {/* TOP HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              mb-5
            "
          >

            {/* TITLE */}

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-indigo-50
                  text-[#4B49AC]
                  flex
                  items-center
                  justify-center
                  shadow-sm
                "
              >
                {activeTabData?.icon && (
                  <activeTabData.icon size={19} />
                )}
              </div>

              <div>

                <h2
                  className="
                    text-base
                    font-bold
                    text-gray-800
                    tracking-tight
                  "
                >
                  {activeTabData?.label}
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-0.5
                  "
                >
                  {activeTabData?.description}
                </p>

              </div>

            </div>

            {/* TYPE BADGE */}

            <div
              className="
                hidden
                sm:flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-gray-100
                border
                border-gray-200
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              <span
                className="
                  text-[11px]
                  font-medium
                  text-gray-500
                  capitalize
                "
              >
                {type || "Record"}
              </span>

            </div>

          </div>


          {/* =====================================
              TABS
          ====================================== */}

          <div
            className="
              flex
              items-center
              gap-1.5
              p-1
              rounded-2xl
              bg-gray-100/80
              border
              border-gray-200/70
              w-fit
              max-w-full
              overflow-x-auto
              scrollbar-none
            "
          >

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`
                    relative
                    flex
                    items-center
                    gap-2
                    h-10
                    px-4
                    rounded-xl
                    text-sm
                    font-medium
                    whitespace-nowrap
                    transition-all
                    duration-200
                    outline-none
                    ${
                      isActive
                        ? `
                          bg-white
                          text-[#4B49AC]
                          shadow-[0_2px_10px_rgba(15,23,42,0.08)]
                        `
                        : `
                          text-gray-500
                          hover:text-gray-800
                          hover:bg-white/70
                        `
                    }
                  `}
                >

                  {/* ICON */}

                  <Icon
                    size={16}
                    strokeWidth={
                      isActive ? 2.4 : 2
                    }
                  />

                  {/* LABEL */}

                  <span>
                    {tab.label}
                  </span>

                  {/* ACTIVE INDICATOR */}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-1/2
                        -translate-x-1/2
                        w-5
                        h-[2px]
                        rounded-full
                        bg-indigo-500
                      "
                    />
                  )}

                </button>
              );
            })}

          </div>

        </div>


        {/* =====================================
            BODY
        ====================================== */}

        <div
          className="
            p-5
            lg:p-6
            min-h-[500px]
            bg-white
            rounded-b-3xl
          "
        >

          {/* NOTES */}

          {activeTab === "notes" && (
            <div
              key="notes"
              className="
                animate-[fadeIn_.2s_ease-out]
              "
            >
              <NotesTab
                type={type}
                data={data}
                setData={setData}
              />
            </div>
          )}


          {/* ACTIVITY */}

          {activeTab === "activity" && (
            <div
              key="activity"
              className="
                animate-[fadeIn_.2s_ease-out]
              "
            >
              <ActivityTab
                type={type}
                data={data}
                setData={setData}
              />
            </div>
          )}


          {/* EMAIL */}

          {/* 
          {activeTab === "email" && (
            <div>
              <EmailTab
                type={type}
                data={data}
                setData={setData}
              />
            </div>
          )}
          */}


          {/* FILES */}

          {/* 
          {activeTab === "files" && (
            <div>
              <FilesTab
                type={type}
                data={data}
                setData={setData}
              />
            </div>
          )}
          */}

        </div>

      </div>

    </div>
  );
}