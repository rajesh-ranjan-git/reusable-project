import mongoose from "mongoose";

import { DB_URL } from "./db.config.js";

const connectDB = async () => {
  try {
    if (DB_URL.includes("srv")) {
      logger.info("⌛ Connecting production database...");
    } else {
      logger.info(
        "⌛ Production database is not available, connecting local database...",
      );
    }

    await mongoose.connect(DB_URL);

    logger.success(
      `✅ [ DATABASE CONNECTION SUCCESS ] - Database connected successfully!`,
    );
  } catch (error) {
    logger.error(
      `❌ [ DATABASE CONNECTION FAILED ] - Unable to connect to database "${DB_URL}":`,
      error,
    );

    process.exit(1);
  }
};

export default connectDB;
