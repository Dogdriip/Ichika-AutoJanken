// eslint-disable-next-line no-unused-vars
const chromium = require('chrome-aws-lambda');
const fs = require('fs');
const crypto = require('crypto');

const BASE_URL = 'https://p.eagate.573.jp';
const LOGIN_URL = `${BASE_URL}/gate/p/login.html`;

const DATA_PATH = './data';
const CAPTCHA_JSON = `${DATA_PATH}/captcha.json`;
const LOGIN_DATA_JSON = `${DATA_PATH}/login_data.json`;

const captchaAns = JSON.parse(fs.readFileSync(CAPTCHA_JSON));
const loginData = JSON.parse(fs.readFileSync(LOGIN_DATA_JSON));

/**
 * Get image md5 hash from image URL. HTTP protocol URL.
 */
const getImageHash = async (browser, url) => {
  const page = await browser.newPage();

  const imgView = await page.goto(url);
  const buffer = await imgView.buffer();

  // Convert buffer to md5 hash.
  const md5 = crypto.createHash('md5').update(buffer).digest('hex');

  await page.close();
  return md5;
};

/**
 * Login to eagate.
 */
const eagateLogin = async (browser) => {
  const page = await browser.newPage();
  // Go to login page.
  // await page.goto(LOGIN_URL);
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' }); // well...

  // Get correct_pic.
  // const corrPic = await page.$("#id_cpfm_correct_pic");
  // const corrPicSrc = await page.evaluate(e => e.src, corrPic);
  const corrPicSrc = await page.$eval('#id_cpfm_correct_pic', (e) => e.src);
  console.log(`correct_pic : ${corrPicSrc}`);

  // Get correct_pic md5 hash.
  const corrPicHash = await getImageHash(browser, corrPicSrc);
  console.log(`correct_pic md5 : ${corrPicHash}`);

  // Get choice answers (5 hashes) from captchaAns - JSON parsed.
  const choiceAns = captchaAns[corrPicHash].choice_md5;
  console.log(choiceAns);

  // Iterate div > label, check each label's inner img hash, check if it's correct.
  const choiceList = await page.$$('.cl_cpfm_choicelistbox > label');
  for (const choice of choiceList) {
    const choicePicSrc = await choice.$eval('img', (e) => e.src);
    const choiceInput = await choice.$('input');
    console.log(choicePicSrc);

    const choicePicHash = await getImageHash(browser, choicePicSrc);
    console.log(choicePicHash);

    if (choiceAns.includes(choicePicHash)) {
      await choiceInput.evaluate((e) => e.checked = true);
      console.log('checked');
    }
  }

  // Fill input form with login_data.json.
  // Be aware of usage of local variables in eval.
  // See https://stackoverflow.com/questions/47966510/how-to-fill-an-input-field-using-puppeteer
  await page.$eval('input[name="nm_login_id"]', (e, value) => e.value = value, loginData.id);
  await page.$eval('input[name="nm_paswords"]', (e, value) => e.value = value, loginData.password);

  // Click login btn and wait until loaded.
  await page.click('.cl_lgfm_loginbtn');
  await page.waitForNavigation();

  // await page.screenshot({ path: 'test.png' });

  // assume it is succeed. test needed...
  console.log('login succeed');

  await page.close();
  return 'success';
};

module.exports.eagateLogin = eagateLogin;
