import { motion } from "framer-motion";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Layout({ children, contentClassName = "", mainClassName = "", showFooter = true }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.18),transparent_24%),linear-gradient(180deg,rgba(7,17,31,0.98),rgba(3,7,18,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`flex-1 ${mainClassName}`}
        >
          <div className={contentClassName}>{children}</div>
        </motion.main>
        {showFooter ? <Footer /> : null}
      </div>
    </div>
  );
}

export default Layout;
