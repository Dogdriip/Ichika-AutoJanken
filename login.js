const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const axios = require("axios");

const BASE_URL = "https://p.eagate.573.jp/"
const LOGIN_URL = BASE_URL + "gate/p/login.html";
const LOGIN_AUTH_URL = BASE_URL + "gate/p/common/login/api/login_auth.html";
const LOGIN_RESRV_URL = BASE_URL + "gate/p/login_complete.html";

const json = `{
    "9bc7769709fb3ea9dfde557114a4fafc": {
        "name": "twinbee",
        "correct_md5": "9bc7769709fb3ea9dfde557114a4fafc",
        "choice_md5": [
            "3aea602a1fb82b86df00832599e99550",
            "5de00f3d6d6d8d5b378da307bc1245f9",
            "32908c88748bc6097129c67255a28ae8",
            "26000240431f6ec78bfcb76dd493a0d9",
            "bfb0932cce45d2bfa132ca05367309e8"
        ]
    },
    "71d44daa0af15ee66d35df6b6a55f73f": {
        "name": "bomber",
        "correct_md5": "71d44daa0af15ee66d35df6b6a55f73f",
        "choice_md5": [
            "4f303172009ec741ad86fc08646245a0",
            "0753041e08cfa0b322182a1c90647f42",
            "a0c115ed425765d3ceb36b1bec8c5c5f",
            "b4df277bc8057f92257e06f94c1d6321",
            "be70c62be274742771ad0d6198b918d3"
        ]
    },
    "be03cce419a71f81fc43af1c71f47cc1": {
        "name": "shiori",
        "correct_md5": "be03cce419a71f81fc43af1c71f47cc1",
        "choice_md5": [
            "5cd8a16750d3193d91b97ff26d9805f9",
            "9eeddbe6cc1c4e32765ddfb5dafc309c",
            "35bc09b719c0ff075097d94733fd712e",
            "272a461ba9b6f69ce6de8ef0670b2679",
            "eaa1c324db9a0db9e782ecf7cfffdf4f"
        ]
    },
    "39d0b10cb1fd3f12d310efd07323b873": {
        "name": "louie",
        "correct_md5": "39d0b10cb1fd3f12d310efd07323b873",
        "choice_md5": [
            "7d3132668987d9155363bab78d27e7f4",
            "568bce3bcb8c5a19fefca1c50934b12e",
            "37116d63462ef81fe3b72ec57ede3f13",
            "b12704c2939f55b66f47d53f6d61af15",
            "ce734d5ec8b46a7a333609e6dd864f93"
        ]
    },
    "1125bf23bfd6f8ceab1fe91ae1cf2a54": {
        "name": "goemon",
        "correct_md5": "1125bf23bfd6f8ceab1fe91ae1cf2a54",
        "choice_md5": [
            "39eb3b335122337be84d3b591855966c",
            "93c6c1721f6f8475c502a1237f3c99d5",
            "96ee4dbc156c6a8948dde32783d852c8",
            "222114e728406f87493b88ae388a4440",
            "f4d24a8cec9c334318d6590a86e6c349"
        ]
    }
}`

const captchaAns = JSON.parse(json);







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
    const corrPicSrc = await page.$eval("#id_cpfm_correct_pic", e => e.src);
    console.log(`correct_pic : ${corrPicSrc}`);

    // Get correct_pic md5 hash.
    const corrPicHash = await getImageHash(browser, corrPicSrc);
    console.log(`correct_pic md5 : ${corrPicHash}`);


    // Get choice answers (5 hashes) from captchaAns - JSON parsed.
    const choiceAns = captchaAns[corrPicHash]['choice_md5'];
    console.log(choiceAns);

    // Iterate div > label, check each label's inner img hash, check if it's correct.
    const choiceList = await page.$$(".cl_cpfm_choicelistbox > label");
    for (let choice of choiceList) {
        const choicePicSrc = await choice.$eval("img", e => e.src);
        const choiceInput = await choice.$("input");
        console.log(choicePicSrc);

        const choicePicHash = await getImageHash(browser, choicePicSrc);
        console.log(choicePicHash);
        
        if (choiceAns.includes(choicePicHash)) {
            await choiceInput.evaluate(e => e.checked = true);
            console.log(`checked`);
        }
        
    }

    // TODO: Fill input form, click login.



    // console.log(choiceList);
    // choiceListPic.forEach((element) => {
        // const img = await element.$(".cl_cpfm_choicelistpic");
        // const imgurl = await page.evaluate(e => e.src, img);
        // console.log(imgurl);
    // });


    await page.close();

    return 'success';
}

module.exports.eagate_login = eagate_login