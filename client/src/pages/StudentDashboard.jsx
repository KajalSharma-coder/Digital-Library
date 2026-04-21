import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookOpen, FaRegClock, FaUserGraduate } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import api from "../api/axios";
import DashboardShell from "../components/DashboardShell.jsx";
import Layout from "../components/Layout.jsx";
import LoaderCard from "../components/LoaderCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", category: "", page: 1 });

  const fetchBooks = async (params = filters) => {
    setLoadingBooks(true);
    try {
      const { data } = await api.get("/books", { params: { ...params, limit: 6 } });
      setBooks(data.books);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load books");
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/books/categories");
      setCategories(data.categories);
    } catch (_error) {
      setCategories([]);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get("/transactions/my-history");
      setHistory(data.transactions);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

  const issueCounts = useMemo(() => {
    const active = history.filter((item) => item.status === "approved").length;
    const pending = history.filter((item) => item.status === "pending").length;
    return { active, pending };
  }, [history]);

  const handleRequest = async (bookId) => {
    try {
      await api.post(`/transactions/request/${bookId}`);
      toast.success("Book request sent");
      fetchBooks(filters);
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not request book");
    }
  };

  return (
    <Layout mainClassName="pb-6" showFooter={false}>
      <DashboardShell
        title={`Welcome, ${user?.name?.split(" ")[0] || "Student"}`}
        subtitle="Browse the catalog, submit issue requests, and keep your reading activity in sync through a cleaner, richer dashboard."
        navItems={[
          { id: "overview", label: "Overview" },
          { id: "books", label: "Browse Books" },
          { id: "history", label: "Issue History" },
          { id: "profile", label: "Profile" },
        ]}
        actions={[
          <button key="logout" type="button" onClick={logout} className="secondary-btn">
            Logout
          </button>,
        ]}
      >
        <section id="overview" className="grid gap-5 md:grid-cols-3">
          {[
            ["Active issues", issueCounts.active, FaBookOpen],
            ["Pending requests", issueCounts.pending, FaRegClock],
            ["Books explored", history.length, FaUserGraduate],
          ].map(([label, value, Icon], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl font-bold">{value}</p>
            </motion.div>
          ))}
        </section>

        <section id="books" className="mt-8 panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Available books</h2>
              <p className="mt-2 text-sm text-slate-500">Search, filter, and request titles from the live library collection.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  className="input pl-10"
                  placeholder="Search title, author, or ISBN"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>
              <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loadingBooks && Array.from({ length: 6 }).map((_, index) => <LoaderCard key={index} />)}
            {!loadingBooks &&
              books.map((book) => (
                <motion.div key={book._id} whileHover={{ y: -6 }} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
                  <div className="mb-4 rounded-[24px] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_35%),linear-gradient(135deg,#fff7ed,#ffffff,#ecfeff)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">{book.category}</p>
                    <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">{book.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Available copies</span>
                    <span className="font-semibold text-slate-900">{book.availableCopies}</span>
                  </div>
                  <button
                    type="button"
                    disabled={book.availableCopies < 1}
                    onClick={() => handleRequest(book._id)}
                    className="primary-btn mt-5 w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {book.availableCopies < 1 ? "Unavailable" : "Request Book"}
                  </button>
                </motion.div>
              ))}
            {!loadingBooks && !books.length && (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 md:col-span-2 xl:col-span-3">
                No books matched your current search. Try another title or category.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages || 1}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={filters.page >= (pagination.totalPages || 1)}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section id="history" className="mt-8 panel">
          <h2 className="font-display text-2xl font-bold">Issued books history</h2>
          <p className="mt-2 text-sm text-slate-500">Track your pending, approved, rejected, and returned books.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Book</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Requested</th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                  <tr>
                    <td colSpan="3" className="py-6 text-slate-500">
                      Loading history...
                    </td>
                  </tr>
                ) : history.length ? (
                  history.map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="py-4 font-medium text-slate-800">{item.book?.title || "Book removed"}</td>
                      <td className="py-4 capitalize">{item.status}</td>
                      <td className="py-4">{new Date(item.requestedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-6 text-slate-500">
                      No issue history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="profile" className="mt-8 panel">
          <h2 className="font-display text-2xl font-bold">Profile</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Name", user?.name],
              ["Email", user?.email],
              ["Course", user?.course || "Not added"],
              ["Year", user?.year || "Not added"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </DashboardShell>
    </Layout>
  );
}

export default StudentDashboard;
