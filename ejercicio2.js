const puppeteer = require("puppeteer");
const fs = require("fs");
const url = process.env.URL || process.argv[2];
const api_key = process.env.URL || process.argv[3];
// ScrapeOps proxy configuration
PROXY_USERNAME = 'scrapeops.headless_browser_mode=true';
PROXY_PASSWORD = api_key; // <-- enter your API_Key here
PROXY_SERVER = 'proxy.scrapeops.io';
PROXY_SERVER_PORT = '5353';

if (!url) {
  console.error("Por favor proporciona una URL como argumento");
  process.exit(1);
}
if (!api_key) {
  console.error("Por favor proporciona una api_key");
  process.exit(1);
}

(async () => {
  try {
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true,args: ['--no-sandbox', '--disable-setuid-sandbox',`--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}`]});
    const page = await browser.newPage();
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);
    
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForFunction('document.readyState === "complete"');
    const categories = await page.evaluate(() => {
      const categories = [];
      const categoryElements = document.querySelectorAll(
        ".flex.justify-between.mb3.mb2-m.pr3.pr4-m.pr0-xl.items-baseline"
      );

      categoryElements.forEach((categoryElement) => {
        const section = categoryElement.parentElement
        const categoryName = section.querySelector('h2.f4.f3-m.lh-title.ma0').innerText.trim();
        const productElements = section.querySelectorAll('li');

        const products = Array.from(productElements).map((productElement) => {
          const name = productElement
            .querySelector('[data-automation-id="product-title"]')
            .innerText.trim();
          const price = productElement
            .querySelector('[data-automation-id="product-price"] .b')
            .innerText.trim();
          const url = `https://super.walmart.com.mx${productElement
            .querySelector("a[link-identifier]")
            .getAttribute("href")
            .trim()}`;

          return { name, price, url };
        });

        categories.push({ categoryName: categoryName, products });
      });

      return categories;
    });

    console.log(categories);
    const jsonResult = JSON.stringify(categories, null, 2);
    fs.writeFile("./output/result.json", jsonResult, "utf8", (err) => {
      if (err) {
        console.log("Error al guardar el archivo:", err);
      } else {
        console.log("Archivo JSON guardado con éxito.");
      }
    });

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
