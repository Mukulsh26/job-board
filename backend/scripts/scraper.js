const puppeteer = require("puppeteer");

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
    console.log("✅ Scraped jobs:", JSON.stringify(jobs, null, 2));

  } catch (error) {
    console.error("❌ Error scraping jobs:", error);
  }

  await browser.close();
}

module.exports = scrapeJobs;
