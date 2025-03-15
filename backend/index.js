require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/JobRoutes");
const scrapeJobs = require("./scripts/scraper");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/jobs", jobRoutes);

// Run scraper once on startup
scrapeJobs();

// Schedule scraper every 24 hours
cron.schedule("0 0 * * *", scrapeJobs, { scheduled: true });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
