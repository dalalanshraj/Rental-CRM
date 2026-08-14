import { useEffect, useState } from "react";
import api from "../api/axios";
import { User, Mail, Phone, Camera, Save } from "lucide-react";

export default function PersonalPreferences() {

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await api.get("/auth/me");

        const data = res.data;

        setUser(data);

        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setPhoto(data.photo || "");

      } catch (error) {

        console.log(
          "Profile error:",
          error
        );

      }

    };

    fetchProfile();

  }, []);


  // ==========================================
  // PHOTO
  // ==========================================

  const handlePhotoChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    // temporary preview
    const reader = new FileReader();

    reader.onloadend = () => {

      setPhoto(reader.result);

    };

    reader.readAsDataURL(file);

  };


  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = async () => {

    try {

      setSaving(true);
      setMessage("");

      const res = await api.put(
        "/auth/me",
        {
          name,
          email,
          phone,
          photo,
        }
      );

      const updatedUser = res.data;

setUser(updatedUser);

localStorage.setItem(
  "userName",
  updatedUser.name || ""
);

localStorage.setItem(
  "userEmail",
  updatedUser.email || ""
);

localStorage.setItem(
  "userPhoto",
  updatedUser.photo || ""
);
window.dispatchEvent(
  new Event("profileUpdated")
);

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.log(error);

      setMessage(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }

  };


  if (!user) {

    return (
      <div className="p-8">
        Loading profile...
      </div>
    );

  }


  return (

    <div className="max-w-4xl mx-auto">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <h1 className="text-2xl font-semibold text-gray-800">
          Personal preferences
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information and profile.
        </p>

      </div>


      {/* =====================================
          PROFILE CARD
      ====================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* PROFILE HEADER */}

        <div className="px-8 py-7 border-b border-gray-100">

          <div className="flex items-center gap-5">

            {/* PHOTO */}

            <div className="relative">

              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-gradient-to-br
                  from-indigo-500
                  to-blue-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-3xl
                  font-semibold
                  overflow-hidden
                "
              >

                {photo ? (

                  <img
                    src={photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  name
                    ?.charAt(0)
                    ?.toUpperCase()

                )}

              </div>


              {/* CAMERA */}

              <label
                htmlFor="profilePhoto"
                className="
                  absolute
                  bottom-0
                  right-0
                  w-9
                  h-9
                  rounded-full
                  bg-white
                  border
                  border-gray-200
                  shadow-md
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:bg-gray-50
                  transition
                "
              >

                <Camera
                  size={17}
                  className="text-gray-600"
                />

              </label>

              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

            </div>


            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                {name || "User"}
              </h2>

              <p className="text-sm text-gray-500">
                {user.role}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            FORM
        ====================================== */}

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    border
                    border-gray-200
                    rounded-xl
                    outline-none
                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10
                  "
                />

              </div>

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    border
                    border-gray-200
                    rounded-xl
                    outline-none
                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10
                  "
                />

              </div>

              <p className="text-xs text-gray-400 mt-2">
                This email is also used for login and activity reminders.
              </p>

            </div>


            {/* PHONE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    border
                    border-gray-200
                    rounded-xl
                    outline-none
                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10
                  "
                />

              </div>

            </div>


            {/* ROLE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account type
              </label>

              <input
                value={user.role}
                disabled
                className="
                  w-full
                  h-11
                  px-4
                  border
                  border-gray-200
                  rounded-xl
                  bg-gray-50
                  text-gray-500
                  capitalize
                "
              />

            </div>

          </div>


          {/* MESSAGE */}

          {message && (

            <div
              className="
                mt-6
                px-4
                py-3
                rounded-xl
                bg-green-50
                text-green-700
                text-sm
              "
            >
              {message}
            </div>

          )}


          {/* SAVE */}

          <div className="flex justify-end mt-8">

            <button
              onClick={handleSave}
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                bg-[#4B49AC]
                text-white
                font-medium
                hover:bg-indigo-700
                transition
                disabled:opacity-60
              "
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save changes"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}