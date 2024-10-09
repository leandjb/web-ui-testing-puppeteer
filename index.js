const puppeteer = require('puppeteer');

(async () => {
    const URL = "https://www.ebay.com/"

    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "networkidle2" });

    const pageTitle = await page.title();
    console.log(`Webpage Title >> ${pageTitle}`)
})();