import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookMedical, FaClipboardList, FaUsersCog } from "react-icons/fa";
import { HiChartBar, HiMiniPlus } from "react-icons/hi2";
import api from "../api/axios";
import BookFormModal from "../components/BookFormModal.jsx";
import DashboardShell from "../components/DashboardShell.jsx";
import Layout from "../components/Layout.jsx";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    issuedBooks: 0,
    pendingRequests: 0,
    recentTransactions: [],
  });
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load stats");
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books", { params: { page: 1, limit: 20 } });
      setBooks(data.books);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load books");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setStudents(data.students);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load students");
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data.transactions);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load transactions");
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchStats(), fetchBooks(), fetchStudents(), fetchTransactions()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleBookSubmit = async (payload) => {
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, payload);
        toast.success("Book updated");
      } else {
        await api.post("/books", payload);
        toast.success("Book added");
      }

      setModalOpen(false);
      setEditingBook(null);
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save book");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      toast.success("Book deleted");
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete book");
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Student removed");
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete student");
    }
  };

  const updateTransaction = async (id, action) => {
    try {
      await api.patch(`/transactions/${id}/${action}`);
      const messages = {
        approve: "Request approved",
        reject: "Request rejected",
        return: "Book marked returned",
      };
      toast.success(messages[action] || "Request updated");
      refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update request");
    }
  };

  return (
    <Layout mainClassName="pb-6" showFooter={false}>
      <DashboardShell
        title="Admin Dashboard"
        subtitle="Manage catalog operations, circulation requests, and student records from a more polished control center."
        navItems={[
          { id: "overview", label: "Overview" },
          { id: "books", label: "Books" },
          { id: "requests", label: "Requests" },
          { id: "students", label: "Students" },
        ]}
        actions={[
          <button
            key="book"
            type="button"
            onClick={() => {
              setEditingBook(null);
              setModalOpen(true);
            }}
            className="primary-btn gap-2"
          >
            <HiMiniPlus size={18} />
            Add Book
          </button>,
        ]}
      >
        <section id="overview" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total books", stats.totalBooks, FaBookMedical],
            ["Students", stats.totalUsers, FaUsersCog],
            ["Issued books", stats.issuedBooks, HiChartBar],
            ["Pending requests", stats.pendingRequests, FaClipboardList],
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold">Book inventory</h2>
              <p className="mt-2 text-sm text-slate-500">Create, update, and remove books from one organized interface.</p>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Copies</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length ? (
                  books.map((book) => (
                    <tr key={book._id} className="border-t border-slate-100">
                      <td className="py-4">
                        <p className="font-semibold text-slate-900">{book.title}</p>
                        <p className="text-slate-500">{book.author}</p>
                      </td>
                      <td className="py-4">{book.category}</td>
                      <td className="py-4">
                        {book.availableCopies}/{book.quantity}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBook(book);
                              setModalOpen(true);
                            }}
                            className="rounded-full border border-slate-200 px-4 py-2 font-semibold transition hover:border-orange-300 hover:text-orange-600"
                          >
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteBook(book._id)} className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-slate-500">
                      No books in the catalog yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="requests" className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="panel overflow-x-auto">
            <h2 className="font-display text-2xl font-bold">Book requests</h2>
            <table className="mt-6 min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Book</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-t border-slate-100">
                      <td className="py-4">{transaction.user?.name}</td>
                      <td className="py-4">{transaction.book?.title}</td>
                      <td className="py-4 capitalize">{transaction.status}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          {transaction.status === "pending" && (
                            <>
                              <button type="button" onClick={() => updateTransaction(transaction._id, "approve")} className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-600">
                                Approve
                              </button>
                              <button type="button" onClick={() => updateTransaction(transaction._id, "reject")} className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-600">
                                Reject
                              </button>
                            </>
                          )}
                          {transaction.status === "approved" && (
                            <button type="button" onClick={() => updateTransaction(transaction._id, "return")} className="rounded-full bg-sky-100 px-4 py-2 font-semibold text-sky-600">
                              Mark Returned
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-slate-500">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2 className="font-display text-2xl font-bold">Recent activity</h2>
            <div className="mt-6 space-y-4">
              {stats.recentTransactions?.length ? (
                stats.recentTransactions.map((item) => (
                  <div key={item._id} className="rounded-[24px] bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{item.user?.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.status} request for {item.book?.title}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent activity yet.</p>
              )}
            </div>
          </div>
        </section>

        <section id="students" className="mt-8 panel">
          <h2 className="font-display text-2xl font-bold">Student management</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length ? (
                  students.map((student) => (
                    <tr key={student._id} className="border-t border-slate-100">
                      <td className="py-4">{student.name}</td>
                      <td className="py-4">{student.email}</td>
                      <td className="py-4">{student.course || "N/A"}</td>
                      <td className="py-4">
                        <button type="button" onClick={() => handleDeleteStudent(student._id)} className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-slate-500">
                      No students registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <BookFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingBook(null);
          }}
          onSubmit={handleBookSubmit}
          book={editingBook}
        />
      </DashboardShell>
    </Layout>
  );
}

export default AdminDashboard;
