
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const nextErrors = {};
    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (
      form.password.length < 8 ||
      form.password.length > 128
    ) {
      nextErrors.password =
        "Password must be between 8 and 128 characters.";
    }

    return nextErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (!error.response) {
        setServerError(
          "Unable to reach the server. Check whether the backend is running."
        );
      } else {
        setServerError(
          error.response.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-xl font-bold">
            N
          </div>
          <span className="text-xl font-semibold tracking-tight">
            NexaDesk
          </span>
        </Link>

        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
            Your work, in focus
          </p>
          <h1 className="text-5xl font-semibold leading-tight xl:text-6xl">
            Make space for your best work.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            A simple workspace to bring your priorities,
            progress, and daily tasks together.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Designed for</p>
              <p className="mt-2 text-lg font-medium">Clarity</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Built around</p>
              <p className="mt-2 text-lg font-medium">Productivity</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-slate-400">
          © {new Date().getFullYear()} NexaDesk. Demo project.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 flex items-center gap-3 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              N
            </span>
            <span className="text-xl font-semibold">NexaDesk</span>
          </Link>

          <p className="text-sm font-semibold text-indigo-600">
            WELCOME BACK
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your details to access your workspace.
          </p>

          {serverError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full rounded-xl border bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-indigo-500"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400">
                  Demo authentication
                </span>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute inset-y-0 right-3 text-sm font-medium text-indigo-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-7 rounded-xl bg-indigo-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Local demo credentials
            </p>
            <p className="mt-2 break-all text-sm text-slate-700">
              Email: demo@nexadesk.dev
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Password: Nexa@12345
            </p>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            NexaDesk is a demonstration application. Do not use
            real or sensitive credentials.
          </p>
        </div>
      </section>
    </main>
  );
}
