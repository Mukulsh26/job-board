const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find().skip((page - 1) * limit).limit(parseInt(limit));
  const totalJobs = await Job.countDocuments();

  res.json({ jobs, totalJobs, totalPages: Math.ceil(totalJobs / limit) });
});

router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  res.json(job);
});

module.exports = router;
