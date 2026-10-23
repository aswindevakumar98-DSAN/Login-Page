
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) navigate("/login", { replace: true });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch {
      setError("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              N
            </div>
            <span className="text-xl font-semibold text-slate-900">
              NexaDesk
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            {loggingOut ? "Signing out..." : "Log out"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="text-sm font-medium text-indigo-600">
          YOUR WORKSPACE
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome back{user?.name ? `, ${user.name}` : ""}.
        </h1>

        <p className="mt-3 text-slate-500">
          You have successfully authenticated with NexaDesk.
        </p>

        {error && (
          <p role="alert" className="mt-5 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Account status</p>
            <p className="mt-3 text-2xl font-semibold text-emerald-600">
              Authenticated
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Your server session is active.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Workspace</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              My Dashboard
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Your demo workspace is ready.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="mt-3 break-all text-lg font-semibold text-slate-900">
              {user?.email || "Loading account..."}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Demo account
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
