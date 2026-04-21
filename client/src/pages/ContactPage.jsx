import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEnvelopeOpenText, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";
import { siteContact } from "../constants/site.js";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (form.message.trim().length < 10) {
      toast.error("Message should be at least 10 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent successfully");
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout contentClassName="shell py-10 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass-panel">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Reach out to the team behind your upgraded digital library experience.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Questions, support needs, or product feedback all belong here. We built the page to feel just as polished as the rest of the platform, with validation and animated feedback included.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: FaEnvelopeOpenText, title: "Email", text: siteContact.email },
              { icon: FaPhoneAlt, title: "Call", text: siteContact.phoneDisplay },
              { icon: FaMapMarkedAlt, title: "Visit", text: siteContact.address },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/10 p-5">
                <div className="rounded-2xl bg-white/10 p-3 text-orange-300">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{title}</p>
                  <p className="mt-2 text-base font-semibold text-white">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="panel p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Send message</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">We’d love to hear from you</h2>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">Name</label>
              <input className="input" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input min-h-40 resize-none"
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button type="submit" disabled={submitting} className="primary-btn min-w-44">
              {submitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default ContactPage;
