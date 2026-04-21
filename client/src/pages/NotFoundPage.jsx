import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

function NotFoundPage() {
  return (
    <Layout contentClassName="shell grid min-h-[70vh] place-items-center py-16">
      <div className="glass-panel max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-300">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for drifted out of the catalog.</p>
        <Link to="/" className="primary-btn mt-8">
          Return Home
        </Link>
      </div>
    </Layout>
  );
}

export default NotFoundPage;
