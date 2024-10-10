const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://www.ebay.com/';

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const pageTitle = await page.title();
    console.log(`Title >> ${pageTitle}`);

    const searchInput = await page.$('input#gh-ac');
    await searchInput.type('Nvidia GTX 4080');

    const searchButton = await page.$('input#gh-btn');
    await searchButton.click();

    await page.waitForNavigation();

    const products = [];

    let nextPageExists = true;

    while (nextPageExists) {
        const newProducts = await page.evaluate(() => {
            const products = Array.from(
                document.querySelectorAll('.s-item__pl-on-bottom')
            );

            return products.map((product) => ({
                title: product.querySelector('.s-item__title')?.innerText,
                price: product.querySelector('.s-item__price')?.innerText,
            }));
        });

        products.push(...newProducts);

        nextPageExists = await page.evaluate(() => {
            const nextPageButton = document.querySelector('.a.pagination__next');

            if (nextPageButton && !nextPageButton.classList.contains('icon-btn')) {
                nextPageButton.click();
                return true;
            }

            return false;
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(products);
})();

