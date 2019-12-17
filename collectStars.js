const　puppeteer = require('puppeteer-core');
const conf = require('./conf');

const option = {
  executablePath: conf.chromePath,
  headless: false,
  args: [
    '--lang=ja',
    '--window-size=1260,900',
  ]
};

puppeteer.launch(option).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1260, height: 900 });

  // ログインまで
  await page.goto('https://www.showroom-live.com/onlive');
  await page.waitForSelector('body');
  await page.waitFor(3000);
  await page.click('#js-side-box > div > div > ul > li:nth-child(2) > a');
  await page.waitForSelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input');
  await page.type('#js-login-form > div:nth-child(2) > div:nth-child(1) > input', conf.account_id);
  await page.type('#js-login-form > div:nth-child(2) > div:nth-child(2) > input', conf.pass);
  await page.waitFor(5000);
  await page.click('#js-login-submit');

  await page.waitForSelector('#js-onlive-collection', { timeout: 0});

  const rooms = await page.evaluate(() => {
    const li = document.querySelectorAll("#js-onlive-collection > div > section > ul > li > div > div > div.listcard-image > div.listcard-overview > div > a.js-room-link.listcard-join-btn");
    const array = [];
    for(let i = 0; i < 10; i++){
      array.push(li[i].href);
    }
    return array;
  });
  console.log(rooms[9]);
  await  page.waitFor(2000);
  await  page.goto(rooms[9]);
  await  page.waitForSelector('#bonus > section > div.bonus-title', {timeout: 70000}
  );
  await page.close();
  await browser.close();
});