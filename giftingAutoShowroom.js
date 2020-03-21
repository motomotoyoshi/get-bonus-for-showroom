'use strict';

const puppeteer = require('puppeteer-core');
const {
  chromePath,
  account_id,
  pass,
  tRoom1,
  tRoom2
} = require('./conf');

var room;

switch (process.argv[2]) {
  case '1':
    var room = tRoom1
    break;

  case '2':
    var room = tRoom2
    break;

  default:
    console.log('Enter Room number.');
    break;
}

const option = {
  executablePath: chromePath,
  // headless: false,
  args: [
    '--lang=ja',
    '--window-size=1260,900',
    '--no-sandbox',
  ]
};

puppeteer.launch(option).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1260, height: 900 });

  // ログインまで
  await page.goto('https://www.showroom-live.com/onlive');
  await page.waitFor(3000);
  await page.click('#js-side-box > div > div > ul > li:nth-child(2) > button');
  await page.waitForSelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input');
  await page.type('#js-login-form > div:nth-child(2) > div:nth-child(1) > input', account_id);
  await page.type('#js-login-form > div:nth-child(2) > div:nth-child(2) > input', pass);
  await page.waitFor(3000);
  await page.click('#js-login-submit');
  console.log('Signin!');

  await page.waitFor(3000);
  
  // ルームへ入って星を投げる
  try {
    console.log(room);
    await page.goto(room);
    await page.waitForSelector('#room-gift-item-list > li:nth-child(2) > a > img', { timeout: 20000 });
    
    let giftLength = await page.evaluate(() => 
      Number(document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent.replace('× ', ''))
    );
    console.log(await giftLength);

    if (giftLength >= 10) {
      // while(giftLength >= 10) {
        for (var k = 0; k <= 100; k++) {
          await page.click('#room-gift-item-list > li:nth-child(1) > a > img');
        }
        await page.waitFor(3000);

        for (var k = 0; k <= 100; k++) {
          await page.click('#room-gift-item-list > li:nth-child(2) > a > img');
        }
        await page.waitFor(3000);

        for (var k = 0; k <= 100; k++) {
          await page.click('#room-gift-item-list > li:nth-child(3) > a > img');
        }
        await page.waitFor(3000);

        for (var k = 0; k <= 100; k++) {
          await page.click('#room-gift-item-list > li:nth-child(4) > a > img');
        }
        await page.waitFor(3000);

        for (var k = 0; k <= 100; k++) {
          await page.click('#room-gift-item-list > li:nth-child(5) > a > img');
        }
        await page.waitFor(3000);
        let giftLength = await page.evaluate(() =>
          Number(document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent.replace('× ', ''))
        );
        console.log(await giftLength);
      // }
    }
  } catch (e) {
    await page.close();
    await browser.close();
};
  await page.close();
  await browser.close();
});
