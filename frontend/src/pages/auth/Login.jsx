import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
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

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // ========================================
      // SAVE USER SESSION
      // ========================================

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "userId",
        res.data.user.id
      );

      localStorage.setItem(
        "userName",
        res.data.user.name
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // ========================================
      // REDIRECT
      // ========================================

      navigate("/app/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
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

      {/* ========================================
          BACKGROUND DECORATION
      ========================================= */}

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
          pointer-events-none
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
          pointer-events-none
        "
      />

      {/* ========================================
          MAIN CARD
      ========================================= */}

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

        {/* ========================================
            LEFT BRAND PANEL
        ========================================= */}

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

          {/* DECORATIVE CIRCLES */}

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

          {/* BRAND CONTENT */}

          <div className="relative z-10">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-2.5
                py-1
                rounded-full
                bg-white/10
                border
                border-white/10
                mb-4
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-300
                "
              />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.16em]
                  font-semibold
                  text-white/75
                "
              >
                CRM Workspace
              </span>

            </div>

            <h1
              className="
                text-3xl
                leading-[1.1]
                font-bold
                tracking-tight
              "
            >
              Everything your
              <br />
              team needs.
            </h1>

            <p
              className="
                mt-3
                text-xs
                leading-5
                text-white/65
                max-w-[290px]
              "
            >
              Manage leads, organizations, activities
              and customer relationships from one
              powerful workspace.
            </p>

            {/* FEATURES */}

            <div className="mt-6 space-y-3">

              {/* FEATURE 1 */}

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Users size={15} />
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Leads & Organizations
                  </p>

                  <p className="text-[10px] text-white/45">
                    Keep customer information organized
                  </p>

                </div>

              </div>

              {/* FEATURE 2 */}

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <BarChart3 size={15} />
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Track Activities
                  </p>

                  <p className="text-[10px] text-white/45">
                    Stay on top of your sales pipeline
                  </p>

                </div>

              </div>

              {/* FEATURE 3 */}

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/10
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck size={15} />
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    Secure Workspace
                  </p>

                  <p className="text-[10px] text-white/45">
                    Built for modern teams
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-2
            "
          >

            <CheckCircle2
              size={13}
              className="text-white/45"
            />

            <span className="text-[10px] text-white/40">
              Simple. Powerful. Organized.
            </span>

          </div>

        </div>

        {/* ========================================
            RIGHT LOGIN PANEL
        ========================================= */}

        <div
          className="
            flex-1
            flex
            items-center
            justify-center
            px-6
            py-8
            sm:px-10
            sm:py-9
          "
        >

          <div className="w-full max-w-[350px]">

            {/* MOBILE LOGO */}

            <div className="md:hidden flex justify-center mb-6">

              <img
                src="/Logo.png"
                alt="Digify America CRM"
                className="
                  w-[165px]
                  h-auto
                  object-contain
                "
              />

            </div>

            {/* ====================================
                HEADING
            ==================================== */}

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
                  Welcome Back
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
                Sign in to your account
              </h2>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1.5
                  leading-5
                "
              >
                Enter your credentials to continue
                to your CRM workspace.
              </p>

            </div>

            {/* ====================================
                ERROR
            ==================================== */}

            {error && (

              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
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

                <span
                  className="
                    w-5
                    h-5
                    rounded-full
                    bg-red-100
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    font-bold
                    flex-shrink-0
                  "
                >
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>

            )}

            {/* ====================================
                FORM
            ==================================== */}

            <form onSubmit={handleSubmit}>

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
                      text-gray-800
                      outline-none
                      transition-all
                      placeholder:text-gray-400
                      hover:bg-white
                      hover:border-gray-300
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:opacity-60
                    "
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mb-5">

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                      text-gray-800
                      outline-none
                      transition-all
                      placeholder:text-gray-400
                      hover:bg-white
                      hover:border-gray-300
                      focus:bg-white
                      focus:border-[#4B49AC]
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
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
                      hover:text-gray-700
                      transition
                    "
                  >

                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

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
                  duration-200
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

                    Signing in...
                  </>

                ) : (

                  <>
                    Sign in

                    <ArrowRight
                      size={15}
                      className="
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />
                  </>

                )}

              </button>

            </form>

            {/* ====================================
                REGISTER
            ==================================== */}

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

                Don't have an account?

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="
                    ml-1
                    font-semibold
                    text-[#4B49AC]
                    hover:text-indigo-700
                    transition
                  "
                >
                  Create account
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
                Your account information is secure
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}