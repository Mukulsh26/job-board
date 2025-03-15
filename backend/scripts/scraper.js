const puppeteer = require("puppeteer");
const Job = require("../models/Job");

async function scrapeJobs() {
  console.log("🔍 Scraping jobs...");
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ],
  });

  const page = await browser.newPage();
  await page.goto("https://www.naukri.com/project-manager-jobs", { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".srp-jobtuple-wrapper", { timeout: 10000 });

    const jobs = await page.evaluate(() => {
      return [...document.querySelectorAll(".srp-jobtuple-wrapper")].map((job) => ({
        title: job.querySelector(".title")?.innerText.trim() || "N/A",
        company: job.querySelector(".comp-name")?.innerText.trim() || "N/A",
        location: job.querySelector(".locWdth")?.innerText.trim() || "N/A",
        experience: job.querySelector(".expwdth")?.innerText.trim() || "N/A",
        link: job.querySelector(".title")?.href || "#",
      }));
    });

    console.log(`✅ Scraped ${jobs.length} jobs.`);
    
    if (jobs.length > 0) {
      for (let job of jobs) {
        await Job.findOneAndUpdate(
          { link: job.link },
          job,
          { upsert: true }
        );
      }
      console.log("✅ Jobs updated in MongoDB.");
    } else {
      console.log("⚠️ No jobs found. The website structure might have changed.");
    }
  } catch (error) {
    console.error("❌ Error scraping jobs:", error);
  }

  await browser.close();
}

module.exports = scrapeJobs;
