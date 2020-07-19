// eslint-disable-next-line no-unused-vars
const chromium = require('chrome-aws-lambda');

const BASE_URL = 'https://p.eagate.573.jp';
const EVENT_URL = `${BASE_URL}/game/bemani/bjm2020/janken/index.html`;

const getRandomSelect = () => Math.floor(Math.random() * 3) + 1;

/**
 * Login to eagate.
 */
const doJanken = async (browser) => {
  const page = await browser.newPage();

  await page.goto(EVENT_URL, { waitUntil: 'networkidle2' });
  // #janken-select > div > a:nth-child(1)
  // document.querySelector("#janken-select > div > a:nth-child(2)")

  // 1: gu, 2: pa, 3: choki
  const select = getRandomSelect();
  console.log(select);
  const randSelector = `#janken-select > div > a:nth-child(${select})`;
  console.log(randSelector);

  await page.click(randSelector);
  await page.waitForNavigation();

  await page.screenshot({ path: 'test.png' });

  await page.close();
  console.log('janken succeed');
  return 'success';
};

module.exports.doJanken = doJanken;
