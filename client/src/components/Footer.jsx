import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { HiArrowUpRight } from "react-icons/hi2";
import { siteContact } from "../constants/site.js";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
];

const resourceLinks = [
  { label: "Create Account", to: "/register" },
  { label: "Student Dashboard", to: "/student" },
  { label: "Admin Dashboard", to: "/admin" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_28%),linear-gradient(135deg,rgba(7,17,31,0.98),rgba(15,23,42,0.96),rgba(30,41,59,0.95))]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      <div className="shell relative py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-5">
            <div>
              <p className="font-display text-2xl font-bold text-white">
                Astra<span className="text-orange-400">Library</span>
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                A premium digital library workspace for students and administrators who want elegant circulation flows, cleaner organization, and dashboards that feel genuinely modern.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-200 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-white"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Quick Links</p>
            <div className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <Link key={link.label} to={link.to} className="group flex items-center justify-between text-sm text-slate-300 transition hover:text-white">
                  <span>{link.label}</span>
                  <HiArrowUpRight className="opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Workspaces</p>
            <div className="mt-5 space-y-3">
              {resourceLinks.map((link) => (
                <Link key={link.label} to={link.to} className="group flex items-center justify-between text-sm text-slate-300 transition hover:text-white">
                  <span>{link.label}</span>
                  <HiArrowUpRight className="opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">Contact</p>
            <p className="mt-4 text-sm text-slate-300">Need help with your digital library setup or student access?</p>
            <div className="mt-5 space-y-3 text-sm text-slate-200">
              <p>{siteContact.email}</p>
              <p>{siteContact.phoneDisplay}</p>
              <p>{siteContact.address}</p>
            </div>
            <Link to="/contact" className="primary-btn mt-6 w-full">
              Contact Team
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AstraLibrary. Crafted for modern academic experiences.</p>
          <p>Responsive, animated, and shared across the full platform.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
