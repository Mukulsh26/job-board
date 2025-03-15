const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

async function scrapeJobs() {
  console.log("🔍 Scraping jobs without Puppeteer...");

  try {
    const { data } = await axios.get("https://www.naukri.com/product-manager-jobs");
    const $ = cheerio.load(data);

    let jobs = [];

    $(".srp-jobtuple-wrapper").each((index, element) => {
      const title = $(element).find(".title a").text().trim() || "N/A";
      const company = $(element).find(".comp-name").text().trim() || "N/A";
      const location = $(element).find(".locWdth").text().trim() || "N/A";
      const experience = $(element).find(".expwdth").text().trim() || "N/A";
      const link = $(element).find(".title a").attr("href") || "#";

      jobs.push({ title, company, location, experience, link });
    });

    console.log(`✅ Scraped ${jobs.length} jobs.`);

    if (jobs.length > 0) {
      for (let job of jobs) {
        await Job.findOneAndUpdate({ link: job.link }, job, { upsert: true });
      }
      console.log("✅ Jobs updated in MongoDB.");
    } else {
      console.log("⚠️ No jobs found. The website structure might have changed.");
    }

  } catch (error) {
    console.error("❌ Error scraping jobs:", error);
  }
}

module.exports = scrapeJobs;
