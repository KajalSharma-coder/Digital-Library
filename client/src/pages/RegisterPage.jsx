import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookReader, FaRegUserCircle } from "react-icons/fa";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    year: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      await register(form);
      toast.success("Registration successful. Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Layout contentClassName="shell py-10 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass-panel">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Student registration</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Join the library in minutes with a smoother onboarding experience.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Create your student account to browse books, track issue history, and manage reading activity inside a responsive, premium interface.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <FaBookReader className="text-orange-300" size={22} />
              <p className="mt-4 text-base font-semibold text-white">Book discovery built in</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <FaRegUserCircle className="text-cyan-200" size={22} />
              <p className="mt-4 text-base font-semibold text-white">Personalized student workspace</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="panel p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Create account</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Start your reading journey</h2>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            {[
              ["name", "Full Name", "text"],
              ["email", "Email", "email"],
              ["password", "Password", "password"],
              ["course", "Course", "text"],
              ["year", "Year", "text"],
            ].map(([name, label, type]) => (
              <div key={name} className={name === "name" || name === "email" ? "sm:col-span-2" : ""}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  type={type}
                  placeholder={label}
                  required={["name", "email", "password"].includes(name)}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-500 transition hover:text-orange-500">
                Already have an account?
              </Link>
              <button type="submit" className="primary-btn min-w-40">
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default RegisterPage;
