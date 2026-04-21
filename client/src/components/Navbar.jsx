import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt3, HiOutlineSparkles, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = useMemo(
    () =>
      user
        ? [
            { label: user.role === "admin" ? "Admin Dashboard" : "Student Dashboard", to: `/${user.role}` },
          ]
        : [
            { label: "Home", to: "/" },
            { label: "Contact", to: "/contact" },
            { label: "Register", to: "/register" },
          ],
    [user]
  );

  const isDashboard = location.pathname === "/student" || location.pathname === "/admin";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link to={user ? `/${user.role}` : "/"} className="flex items-center gap-3 font-display text-xl font-bold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-orange-300 shadow-lg shadow-orange-500/10">
            <HiOutlineSparkles size={20} />
          </span>
          <span>
            Astra<span className="text-orange-400">Library</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={`/${user.role}`} className="secondary-btn">
                {isDashboard ? "Workspace" : "Dashboard"}
              </Link>
              <button type="button" onClick={logout} className="primary-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="secondary-btn">
                Login
              </NavLink>
              <NavLink to="/register" className="primary-btn">
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-white/10 p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/10 bg-slate-950/95 md:hidden">
          <div className="shell flex flex-col gap-4 py-5">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm font-medium text-slate-200" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={`/${user.role}`} className="secondary-btn" onClick={() => setOpen(false)}>
                  {user.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="primary-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="secondary-btn" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="primary-btn" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;
