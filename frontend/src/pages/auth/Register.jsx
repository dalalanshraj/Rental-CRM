import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name,
        email,
        password,
        role: form.role,
      });

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f6fb]
        flex
        items-center
        justify-center
        px-4
        py-6
        relative
        overflow-hidden
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          -top-40
          -left-40
          w-[380px]
          h-[380px]
          rounded-full
          bg-indigo-200/30
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-[420px]
          h-[420px]
          rounded-full
          bg-violet-200/30
          blur-3xl
        "
      />

      {/* MAIN CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[900px]
          bg-white
          rounded-[26px]
          shadow-[0_25px_70px_rgba(30,41,59,0.12)]
          border
          border-gray-100
          overflow-hidden
          flex
          md:flex-row
        "
      >
        {/* =========================================
            LEFT PANEL
        ========================================== */}

        <div
          className="
            hidden
            md:flex
            md:w-[42%]
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#3F3D91]
            via-[#4B49AC]
            to-[#7068E8]
            p-8
            text-white
            flex-col
            justify-between
          "
        >
          {/* DECORATION */}

          <div
            className="
              absolute
              -top-20
              -right-20
              w-56
              h-56
              rounded-full
              bg-white/[0.07]
            "
          />

          <div
            className="
              absolute
              -bottom-24
              -left-20
              w-64
              h-64
              rounded-full
              bg-white/[0.06]
            "
          />

          {/* LOGO */}

        <div className="relative z-10">

            <img
              src="/Logo.png"
              alt="Digify America CRM"
              className="
                w-[150px]
                h-auto
                object-contain
              "
            />

          </div>


          {/* CONTENT */}

          <div className="relative z-10">

            <span
              className="
                inline-flex
                items-center
                gap-2
                px-2.5
                py-1
                rounded-full
                bg-white/10
                text-[9px]
                uppercase
                tracking-[0.15em]
                font-semibold
                text-white/70
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Join Your Team
            </span>

            <h1
              className="
                text-3xl
                leading-tight
                font-bold
                mt-4
              "
            >
              Build better
              <br />
              relationships.
            </h1>

            <p
              className="
                mt-3
                text-xs
                leading-5
                text-white/65
                max-w-[280px]
              "
            >
              Manage your customers, leads and sales
              activities from one powerful CRM workspace.
            </p>

            {/* FEATURES */}

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Users size={15} />
                </div>

                <span className="text-xs text-white/80">
                  Manage customers
                </span>

              </div>

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <BarChart3 size={15} />
                </div>

                <span className="text-xs text-white/80">
                  Track your pipeline
                </span>

              </div>

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck size={15} />
                </div>

                <span className="text-xs text-white/80">
                  Secure workspace
                </span>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="relative z-10 flex items-center gap-2">

            <CheckCircle2
              size={13}
              className="text-white/50"
            />

            <span className="text-[10px] text-white/45">
              Simple. Powerful. Organized.
            </span>

          </div>

        </div>

        {/* =========================================
            RIGHT FORM
        ========================================== */}

        <div
          className="
            flex-1
            flex
            items-center
            justify-center
            px-6
            py-7
            sm:px-10
            sm:py-8
          "
        >

          <div className="w-full max-w-[350px]">

            {/* MOBILE LOGO */}

            <div className="md:hidden flex justify-center mb-5">

              <img
                src="/Logo.png"
                alt="Digify America CRM"
                className="w-[165px] h-auto object-contain"
              />

            </div>

            {/* HEADING */}

            <div className="mb-5">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-1.5
                "
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-[#4B49AC]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#4B49AC]
                  "
                >
                  Get Started
                </span>

              </div>

              <h2
                className="
                  text-[26px]
                  font-bold
                  text-gray-900
                  tracking-tight
                "
              >
                Create your account
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Set up your CRM workspace in a few seconds.
              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div
                className="
                  mb-4
                  px-3
                  py-2.5
                  rounded-lg
                  border
                  border-red-100
                  bg-red-50
                  text-red-600
                  text-xs
                "
              >
                {error}
              </div>

            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="mb-3.5">

                <label
                  htmlFor="name"
                  className="
                    block
                    text-[11px]
                    font-semibold
                    text-gray-600
                    mb-1.5
                  "
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={16}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={loading}
                    className="
                      w-full
                      h-11
                      pl-10
                      pr-3
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      text-xs
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                    "
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mb-3.5">

                <label
                  htmlFor="email"
                  className="
                    block
                    text-[11px]
                    font-semibold
                    text-gray-600
                    mb-1.5
                  "
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      w-full
                      h-11
                      pl-10
                      pr-3
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      text-xs
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                    "
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-3.5">

                <label
                  htmlFor="password"
                  className="
                    block
                    text-[11px]
                    font-semibold
                    text-gray-600
                    mb-1.5
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="
                      w-full
                      h-11
                      pl-10
                      pr-10
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      text-xs
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-2.5
                      top-1/2
                      -translate-y-1/2
                      w-7
                      h-7
                      rounded-md
                      flex
                      items-center
                      justify-center
                      text-gray-400
                      hover:bg-gray-100
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>

                <p className="text-[10px] text-gray-400 mt-1">
                  Minimum 6 characters.
                </p>

              </div>

              {/* ROLE */}

              <div className="mb-5">

                <label
                  htmlFor="role"
                  className="
                    block
                    text-[11px]
                    font-semibold
                    text-gray-600
                    mb-1.5
                  "
                >
                  Account role
                </label>

                <div className="relative">

                  <ShieldCheck
                    size={16}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      w-full
                      h-11
                      pl-10
                      pr-8
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      text-xs
                      outline-none
                      appearance-none
                      cursor-pointer
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                    "
                  >
                    <option value="sales">
                      Sales
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>

                  <span
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      pointer-events-none
                      text-xs
                    "
                  >
                    ▾
                  </span>

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  w-full
                  h-11
                  rounded-lg
                  bg-gradient-to-r
                  from-[#4B49AC]
                  to-[#6865D8]
                  text-white
                  text-xs
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-md
                  shadow-indigo-500/20
                  hover:shadow-lg
                  hover:-translate-y-[1px]
                  active:translate-y-0
                  transition-all
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        w-3.5
                        h-3.5
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                        animate-spin
                      "
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={15}
                      className="
                        group-hover:translate-x-1
                        transition
                      "
                    />
                  </>
                )}

              </button>

            </form>

            {/* LOGIN */}

            <div
              className="
                mt-5
                pt-4
                border-t
                border-gray-100
                text-center
              "
            >

              <p className="text-xs text-gray-400">

                Already have an account?

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="
                    ml-1
                    font-semibold
                    text-[#4B49AC]
                    hover:text-indigo-700
                  "
                >
                  Sign in
                </button>

              </p>

            </div>

            {/* SECURITY */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-center
                gap-1.5
                text-[10px]
                text-gray-400
              "
            >

              <ShieldCheck size={12} />

              <span>
                Secure CRM workspace
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}