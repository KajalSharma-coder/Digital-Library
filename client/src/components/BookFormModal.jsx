import { useEffect, useState } from "react";

const initialState = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  coverImage: "",
  description: "",
  publishedYear: "",
  quantity: 1,
};

function BookFormModal({ open, onClose, onSubmit, book }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(
      book
        ? {
            ...book,
            publishedYear: book.publishedYear || "",
          }
        : initialState
    );
  }, [book]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === "quantity" || name === "publishedYear" ? Number(value) : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 px-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[30px] bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-900">{book ? "Update Book" : "Add New Book"}</h3>
            <p className="text-sm text-slate-500">Keep your library inventory polished and current.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            Close
          </button>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {["title", "author", "category", "isbn", "coverImage", "publishedYear", "quantity"].map((field) => (
            <div key={field} className={field === "coverImage" ? "sm:col-span-2" : ""}>
              <label className="label capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                required={["title", "author", "category", "isbn", "quantity"].includes(field)}
                type={field === "quantity" || field === "publishedYear" ? "number" : "text"}
                name={field}
                className="input"
                value={form[field] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" className="input min-h-28" value={form.description} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {book ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
