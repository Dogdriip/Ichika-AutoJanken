'use strict';

const chromium = require("chrome-aws-lambda");

const BASE_URL = "https://p.eagate.573.jp/"
const LOGIN_URL = BASE_URL + "gate/p/login.html";
const LOGIN_AUTH_URL = BASE_URL + "gate/p/common/login/api/login_auth.html";
const LOGIN_RESRV_URL = BASE_URL + "gate/p/login_complete.html";
const CAPTCHA_URL = BASE_URL + "gate/p/common/login/api/kcaptcha_generate.html";
const JANKEN_URL = BASE_URL + "game/bemani/bjm2020/janken/index.html";

module.exports.hello = async event => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    // headless: chromium.headless,
    headless: true,  // default is also true
  });
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  
  const test = await page.$("#id_lgfm_inline > div > div.cl_lgfm_eavd.cl_lgfm_title");
  const text = await page.evaluate(e => e.textContent, test);

  console.log(text);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
