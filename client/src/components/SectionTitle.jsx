import { motion } from "framer-motion";

function SectionTitle({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </motion.div>
  );
}

export default SectionTitle;
