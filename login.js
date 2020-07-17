const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const axios = require("axios");

const BASE_URL = "https://p.eagate.573.jp/"
const LOGIN_URL = BASE_URL + "gate/p/login.html";
const LOGIN_AUTH_URL = BASE_URL + "gate/p/common/login/api/login_auth.html";
const LOGIN_RESRV_URL = BASE_URL + "gate/p/login_complete.html";

/**
 * Get image md5 hash from image URL. HTTP protocol URL.
 */
const getImageHash = async (browser, url) => {
    const page = await browser.newPage();

    const imgView = await page.goto(url);
    const buffer = await imgView.buffer();
    
    // Convert buffer to md5 hash.
    let md5 = crypto.createHash('md5').update(buffer).digest('hex');

    await page.close();
    return md5;
}


/**
 * Login to eagate.
 */
const eagate_login = async (browser) => {
    const page = await browser.newPage();
    // Go to login page.
    // await page.goto(LOGIN_URL);
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });  // well...

    // Get correct_pic.
    // const corrPic = await page.$("#id_cpfm_correct_pic");
    // const corrPicSrc = await page.evaluate(e => e.src, corrPic);
    const corrPicSrc = await page.$eval("#id_cpfm_correct_pic", e => e.src);  // not working
    console.log(`correct_pic : ${corrPicSrc}`);

    // Get correct_pic md5 hash.
    const corrPicHash = await getImageHash(browser, corrPicSrc);
    console.log(`correct_pic md5 : ${corrPicHash}`);

    // TODO: Configure captcha answer.
    // TODO: Iterate div array, check each div's inner img hash, check if it's correct.
    // const choiceListPic = await page.$$eval(".cl_cpfm_choicelistbox", e => );
    // console.log(choiceListPic);
    // choiceListPic.forEach((element) => {
        // const img = await element.$(".cl_cpfm_choicelistpic");
        // const imgurl = await page.evaluate(e => e.src, img);
        // console.log(imgurl);
    // });


    await page.close();

    return 'success';
}

module.exports.eagate_login = eagate_login