import app from "./app.js";
import connectDB from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { seedBooks } from "./utils/seedBooks.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  await seedBooks();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
