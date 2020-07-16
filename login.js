const chromium = require("chrome-aws-lambda");

const BASE_URL = "https://p.eagate.573.jp/"
const LOGIN_URL = BASE_URL + "gate/p/login.html";
const LOGIN_AUTH_URL = BASE_URL + "gate/p/common/login/api/login_auth.html";
const LOGIN_RESRV_URL = BASE_URL + "gate/p/login_complete.html";


/**
 * Login to eagate.
 */
const eagate_login = async (page) => {
    await page.goto(LOGIN_URL);
    
    const test = await page.$("#id_lgfm_inline > div > div.cl_lgfm_eavd.cl_lgfm_title");
    const text = await page.evaluate(e => e.textContent, test);

    console.log(text);

    return 'success';
}

module.exports.eagate_login = eagate_login