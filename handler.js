const chromium = require('chrome-aws-lambda');

const { eagateLogin, eagateLogout } = require('./module/eagate');
const { doJanken } = require('./module/janken');

const doEvent = async (event) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: false, // default is true
  });

  await eagateLogin(browser);
  // await doJanken(browser);
  await eagateLogout(browser);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2,
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.doEvent = doEvent;
