const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/JobRoutes");
const scrapeJobs = require("./scripts/scraper");
require("dotenv").config();
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Scrape jobs every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("⏳ Running scheduled job scraper...");
  await scrapeJobs();
});

// ✅ Manually trigger scraping via API
app.get("/api/scrape", async (req, res) => {
  try {
    await scrapeJobs();
    res.json({ message: "✅ Scraping completed!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Scraping failed", details: error.message });
  }
});

// Run scraper once on startup
scrapeJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
