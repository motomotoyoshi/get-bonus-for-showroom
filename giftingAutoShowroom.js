'use strict';

require("dotenv").config();

const puppeteer = require('puppeteer-core');

if (!process.argv[2]) {
  console.log("Enter Room number.");
  return;
}

let room = "";

switch (process.argv[2]) {
  case '1':
    room = process.env.room1
    break;

  case '2':
    room = process.env.room2;
    break;

  case '3':
    room = process.env.room3;
    break;

  default:
    console.log('Enter Room number.');
    break;
}

const option = {
  executablePath: process.env.chromePath,
  headless: false,
  args: [
    "--lang=ja",
    "--window-size=1260,900",
    // '--no-sandbox',
  ],
};

puppeteer.launch(option).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1260, height: 900 });

  // ログインまで
  await page.goto('https://www.showroom-live.com/onlive');
  await page.waitFor(2000);
  await page.click('#js-side-box > div > div > ul > li:nth-child(2) > button');
  await page.waitForSelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input');
  await page.type(
    "#js-login-form > div:nth-child(2) > div:nth-child(1) > input",
    process.env.account_id
  );
  await page.type(
    "#js-login-form > div:nth-child(2) > div:nth-child(2) > input",
    process.env.pass
  );
  await page.waitFor(3000);
  await page.click('#js-login-submit');
  console.log('Signin!');

  await page.waitFor(2000);
  
  // ルームへ入って星を投げる
  try {
    console.log(room);
    await page.goto(room);
    await page.waitFor(2000);
    await page.waitForSelector('#room-gift-item-list > li:nth-child(1) > a > img', { timeout: 20000 });
    
    var giftLength = await page.evaluate(() => 
      Number(document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent.replace('× ', ''))
    );
    console.log(await giftLength);

    if (giftLength > 10) {
      while(giftLength >= 10) {
        for (var k = 0; k <= 10; k++) {
          await page.click('#room-gift-item-list > li:nth-child(1) > a > img');
        }
        await page.waitFor(2000);

        for (var k = 0; k <= 10; k++) {
          await page.click('#room-gift-item-list > li:nth-child(2) > a > img');
        }
        await page.waitFor(2000);

        for (var k = 0; k <= 10; k++) {
          await page.click('#room-gift-item-list > li:nth-child(3) > a > img');
        }
        await page.waitFor(2000);

        for (var k = 0; k <= 10; k++) {
          await page.click('#room-gift-item-list > li:nth-child(4) > a > img');
        }
        await page.waitFor(2000);

        for (var k = 0; k <= 10; k++) {
          await page.click('#room-gift-item-list > li:nth-child(5) > a > img');
        }
        await page.waitFor(2000);
        var giftLength = await page.evaluate(() =>
          Number(document.querySelector("#room-gift-item-list > li:nth-child(5) > div").textContent.replace('× ', ''))
        );
        console.log(await giftLength);
      }
    }

    // 50カウント
    if (process.argv[3] === "c") {
      for (var l = 1; l <= 50; l++) {
        await page.type('#js-chat-input-comment', String(l));
        await page.waitFor(2000);
        await page.click('#js-room-comment > button');
        await page.waitFor(2000);
      }
    }

  } catch (e) {
    console.log(await e);
    // await page.close();
    await browser.close();
  };
  // await page.close();
  await browser.close();
});
