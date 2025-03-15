const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/JobRoutes");
const scrapeJobs = require("./scripts/scraper");
require('dotenv').config();
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Run scraper once on startup
scrapeJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
