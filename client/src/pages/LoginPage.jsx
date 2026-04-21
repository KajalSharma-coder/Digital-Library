import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookOpen, FaUserShield } from "react-icons/fa";
import { HiMiniArrowRight } from "react-icons/hi2";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin, loading, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authUser = await login(form);
      toast.success(`Welcome back, ${authUser.name}`);
      navigate(authUser.role === "admin" ? "/admin" : "/student");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    if (!response.credential) {
      toast.error("Google sign-in did not return a credential");
      return;
    }

    try {
      const authUser = await googleLogin(response.credential);
      toast.success(`Welcome, ${authUser.name}`);
      navigate(authUser.role === "admin" ? "/admin" : "/student");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <Layout contentClassName="shell py-10 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass-panel">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Unified access</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">One login for students and admins, with Google sign-in built in.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Use the same login form for every account. If you are new here, create your account first and then sign in with your email and password or continue with Google.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <FaBookOpen className="text-orange-300" size={22} />
              <p className="mt-4 text-base font-semibold text-white">Unified library access</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <FaUserShield className="text-cyan-200" size={22} />
              <p className="mt-4 text-base font-semibold text-white">JWT-protected sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="panel p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Login</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">Enter your credentials and we will send you to the right workspace automatically.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="primary-btn w-full gap-2">
              {loading ? "Signing in..." : "Continue"}
              {!loading && <HiMiniArrowRight size={18} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {googleClientId ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 p-1">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} width="100%" />
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Add <code>VITE_GOOGLE_CLIENT_ID</code> in the client environment to enable Google sign-in.
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-orange-500">
              Back to home
            </Link>
            <Link to="/register" className="transition hover:text-orange-500">
              Create account
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default LoginPage;
