const chromium = require('chrome-aws-lambda');

try {
  (async () => {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      // headless: chromium.headless,
      headless: true, // default is also true
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');

    const body = await page.$('body');
    const text = await page.evaluate((e) => e.textContent, body);

    console.log(text);

    await browser.close();
  })();
} catch (e) {
  console.error(e);
}
