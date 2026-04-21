import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBookOpen, FaRegCompass, FaUserShield, FaUsers } from "react-icons/fa";
import { HiArrowTrendingUp, HiOutlineBolt, HiOutlineChartBar, HiOutlineClock, HiOutlineSparkles } from "react-icons/hi2";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const features = [
  {
    icon: FaBookOpen,
    title: "Smart Book Management",
    description: "Organize titles, stock, categories, and discovery with a cleaner circulation experience.",
  },
  {
    icon: FaUsers,
    title: "Student-Centered Access",
    description: "Make request flows and account activity intuitive from the first login on any device.",
  },
  {
    icon: HiOutlineClock,
    title: "Faster Issue Workflows",
    description: "Move approvals, returns, and request updates through a polished real-time dashboard flow.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Actionable Insights",
    description: "Surface key library numbers in elegant cards that help admins make decisions quickly.",
  },
];

const highlights = [
  { icon: HiOutlineBolt, title: "Fast circulation", text: "Responsive UI for search, requests, and approvals." },
  { icon: FaUserShield, title: "Secure roles", text: "Student and admin access stay cleanly separated." },
  { icon: FaRegCompass, title: "Guided discovery", text: "Students find books faster with stronger information hierarchy." },
];

function LandingPage() {
  const [workspaceStats, setWorkspaceStats] = useState({
    availableBooks: 0,
    registeredStudents: 0,
    pendingApprovals: 0,
    returnsToday: 0,
  });

  useEffect(() => {
    const fetchWorkspaceStats = async () => {
      try {
        const { data } = await api.get("/books/workspace");
        setWorkspaceStats(data.stats);
      } catch (_error) {
        setWorkspaceStats({
          availableBooks: 0,
          registeredStudents: 0,
          pendingApprovals: 0,
          returnsToday: 0,
        });
      }
    };

    fetchWorkspaceStats();
  }, []);

  const formatCount = (value) => new Intl.NumberFormat("en-IN").format(value || 0);
  const stats = [
    { value: `${formatCount(workspaceStats.availableBooks)}+`, label: "Books available" },
    { value: formatCount(workspaceStats.registeredStudents), label: "Active members" },
    { value: formatCount(workspaceStats.pendingApprovals), label: "Pending approvals" },
  ];
  const liveCards = [
    ["Available books", formatCount(workspaceStats.availableBooks)],
    ["Pending approvals", formatCount(workspaceStats.pendingApprovals)],
    ["Returns today", formatCount(workspaceStats.returnsToday)],
    ["Registered students", formatCount(workspaceStats.registeredStudents)],
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden section-spacing">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <HiOutlineSparkles />
              Premium digital library experience
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              A modern library system that feels as polished as your campus deserves.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              AstraLibrary brings together book discovery, student access, circulation workflows, and admin operations inside a visually rich platform built for clarity, speed, and trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="primary-btn">
                Create Student Account
              </Link>
              <Link to="/contact" className="secondary-btn">
                Talk to Us
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-orange-300">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }} className="glass-card gradient-border mx-auto w-full max-w-2xl p-4 sm:p-6">
            <div className="grid gap-4 rounded-[28px] bg-white p-5 text-slate-900 sm:grid-cols-2 sm:p-6">
              <div className="sm:col-span-2 rounded-[24px] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_35%),linear-gradient(135deg,#fff7ed,#ffffff,#ecfeff)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">Live Workspace</p>
                    <h3 className="mt-2 font-display text-3xl font-bold">Command your library operations beautifully</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">These cards now pull from your actual library data, so new books, signups, requests, and returns show up here automatically.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 p-3 text-orange-300">
                    <FaBookOpen size={24} />
                  </div>
                </div>
              </div>

              {liveCards.map(([label, value]) => (
                <div key={label} className="rounded-[24px] bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="shell section-spacing pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="glass-panel"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-cyan-200">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="shell section-spacing">
        <SectionTitle
          eyebrow="Why AstraLibrary"
          title="Designed for campuses that want a cleaner interface and a smoother daily rhythm."
          description="From first-time students to administrators managing inventory at scale, every screen is organized to reduce friction, improve confidence, and make the whole system feel premium."
        />
      </section>

      <section className="shell section-spacing pt-0">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-panel"
              >
                <div className="inline-flex rounded-2xl bg-orange-400/15 p-3 text-orange-300">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="shell pb-20">
        <div className="glass-panel grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">Dashboard Experience</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">Premium cards, richer hierarchy, and cleaner navigation across every page.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              The updated interface keeps typography, spacing, motion, and shared components consistent from the landing experience to the student and admin workspaces.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: HiArrowTrendingUp, label: "Performance-first layout" },
              { icon: FaBookOpen, label: "Reusable design system" },
              { icon: FaUsers, label: "Responsive dashboards" },
              { icon: HiOutlineSparkles, label: "Modern visual polish" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <Icon className="text-orange-300" size={22} />
                <p className="mt-4 text-base font-semibold text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default LandingPage;
