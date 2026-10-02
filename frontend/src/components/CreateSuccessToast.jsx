import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateSuccess } from "../context/CreateSuccessContext";

export default function CreateSuccessToast() {
  const {
    createdItem,
    hideCreateSuccess,
  } = useCreateSuccess();

  const navigate = useNavigate();

  // =====================================================
  // AUTO HIDE AFTER 2 SECONDS
  // =====================================================

  useEffect(() => {
    if (!createdItem) return;

    const timer = setTimeout(() => {
      hideCreateSuccess();
    }, 2000);

    return () => clearTimeout(timer);
  }, [createdItem, hideCreateSuccess]);

  // =====================================================
  // NOTHING TO SHOW
  // =====================================================

  if (!createdItem) {
    return null;
  }

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = () => {
    const id = createdItem?.data?._id;

    if (!id) {
      return;
    }

    if (createdItem.type === "lead") {
      navigate(`/app/leads/${id}`);
    }

    if (createdItem.type === "organization") {
      navigate(`/app/organizations/${id}`);
    }

    hideCreateSuccess();
  };

  // =====================================================
  // TEXT
  // =====================================================

  const title =
    createdItem.type === "lead"
      ? "Lead created successfully"
      : "Organization created successfully";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        z-[9999]
        w-[calc(100%-32px)]
        max-w-[420px]
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          shadow-[0_15px_40px_rgba(15,23,42,0.18)]
        "
      >
        {/* SUCCESS ICON */}

        <div
          className="
            flex
            h-9
            w-9
            flex-shrink-0
            items-center
            justify-center
            rounded-full
            bg-green-50
            text-green-600
          "
        >
          <CheckCircle2 size={20} />
        </div>

        {/* MESSAGE */}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-gray-400">
            {createdItem?.data?.name || ""}
          </p>
        </div>

        {/* VIEW */}

        <button
          type="button"
          onClick={handleView}
          className="
            flex-shrink-0
            rounded-lg
            bg-[#4B49AC]
            px-3.5
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-[#403e99]
          "
        >
          View
        </button>

        {/* CLOSE */}

        <button
          type="button"
          onClick={hideCreateSuccess}
          className="
            flex
            h-7
            w-7
            flex-shrink-0
            items-center
            justify-center
            rounded-lg
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}