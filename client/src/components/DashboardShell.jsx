import { motion } from "framer-motion";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext.jsx";

function DashboardShell({ title, subtitle, actions, navItems, children }) {
  const { logout, user } = useAuth();

  return (
    <div className="shell py-8 text-slate-900 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden self-start rounded-[32px] border border-white/10 bg-white/10 px-6 py-8 text-white backdrop-blur-2xl shadow-[0_24px_80px_rgba(7,17,31,0.28)] lg:flex lg:sticky lg:top-28 lg:flex-col">
          <div>
            <p className="font-display text-2xl font-bold text-white">
              Astra<span className="text-orange-500">Library</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">{user?.role === "admin" ? "Admin control center" : "Student reading hub"}</p>
          </div>

          <div className="mt-10 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/10 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-auto inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-300 hover:bg-orange-500/15"
          >
            <HiArrowRightOnRectangle size={18} />
            Logout
          </button>
        </aside>

        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.22),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.84))] px-6 py-7 text-white shadow-[0_24px_90px_rgba(7,17,31,0.35)] sm:px-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-orange-300">Dashboard</p>
                <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">{actions}</div>
            </div>
          </motion.div>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
