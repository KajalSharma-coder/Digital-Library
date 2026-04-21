import Book from "../models/Book.js";

const demoBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    isbn: "9780735211292",
    description: "A practical guide to building good habits and breaking bad ones.",
    publishedYear: 2018,
    quantity: 8,
    availableCopies: 8,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "9780262046305",
    description: "A foundational algorithms reference for students and developers.",
    publishedYear: 2022,
    quantity: 5,
    availableCopies: 5,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    isbn: "9781455586691",
    description: "Strategies for focused success in a distracted world.",
    publishedYear: 2016,
    quantity: 6,
    availableCopies: 6,
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "9780132350884",
    description: "A classic on writing maintainable, readable software.",
    publishedYear: 2008,
    quantity: 4,
    availableCopies: 4,
    coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    isbn: "9780857197689",
    description: "Timeless lessons on wealth, greed, and happiness.",
    publishedYear: 2020,
    quantity: 7,
    availableCopies: 7,
    coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    isbn: "9780062316097",
    description: "A brief history of humankind from ancient times to today.",
    publishedYear: 2015,
    quantity: 6,
    availableCopies: 6,
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
  }
];

export const seedBooks = async () => {
  const count = await Book.countDocuments();

  if (count === 0) {
    await Book.insertMany(demoBooks);
    console.log("Demo books seeded");
  }
};

