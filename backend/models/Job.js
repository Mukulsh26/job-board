const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  experience: String,
  link: String,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
