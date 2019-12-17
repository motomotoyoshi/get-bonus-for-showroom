const　puppeteer = require('puppeteer-core');
const conf = require('./conf');

puppeteer.launch(
  {
    executablePath: conf.chromePath,
    headless: false,
    args: [
      '--lang=ja',
      '--window-size=1260,900',
    ]
  }).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 900 });

    // ログインまで
    await page.goto('https://www.showroom-live.com/onlive');
    await page.waitForSelector('body');
    await page.waitFor(5000);
    await page.click('#js-side-box > div > div > ul > li:nth-child(2) > a');
    await page.waitForSelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input');
    await page.type('#js-login-form > div:nth-child(2) > div:nth-child(1) > input', conf.account_id);
    await page.type('#js-login-form > div:nth-child(2) > div:nth-child(2) > input', conf.pass);
    await page.waitFor(5000);
    await page.click('#js-login-submit');
});