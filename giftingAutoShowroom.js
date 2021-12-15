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

  case '4':
    room = process.env.room4;
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
    "--window-size=1400,1000",
    // '--no-sandbox',
  ],
};

puppeteer.launch(option).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  // ログインまで
  await page.goto('https://www.showroom-live.com/onlive');
  await page.waitForTimeout(2000);
  await page.click('#hamburger');
  await page.click('#hamburgerMenu > ul > li:nth-child(10) > button');
  await page.waitForSelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input');
  await page.type(
    "#js-login-form > div:nth-child(2) > div:nth-child(1) > input",
    process.env.account_id
  );
  await page.type(
    "#js-login-form > div:nth-child(2) > div:nth-child(2) > input",
    process.env.pass
  );
  await page.waitForTimeout(3000);
  await page.click('#js-login-submit');

  console.log('Signin!');

  await page.waitForTimeout(2000);
  
  // ルームへ入って星を投げる
  try {
    console.log(room);
    await page.goto(room);
    await page.waitFor(2000);
    await page.waitForSelector('#room-gift-item-list > li:nth-child(1) > a > img', { timeout: 20000 });
    
    let giftLength = await page.evaluate(() => 
      Number(document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent.replace('× ', ''))
    );
    console.log(await giftLength);

    await page.waitFor(3000);

    if (giftLength >= 9) {
      while(giftLength >= 9) {
        await gifting(page, 1);
        await gifting(page, 2);
        await gifting(page, 3);
        await gifting(page, 4);
        await gifting(page, 5);

        giftLength = await page.evaluate(() =>
          Number(document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent.replace('× ', ''))
        );
        console.log(await giftLength);
      }
    }

    // 50カウント
    if (process.argv[3] === "c") {
      for (var l = 1; l <= 50; l++) {
        await page.type('#js-chat-input-comment', String(l));
        await page.waitForTimeout(1500);
        await page.click('#js-room-comment > button');
        await page.waitForTimeout(1500);
      }
    }

  } catch (e) {
    console.log(e.message);
    await browser.close();
  };

  
  if (process.argv[3] === "s" || process.argv[4] === "s") {
    await browser.close();
  }
});



const gifting = async (page, num) => {
  for (var k = 0; k <= 10; k++) {
    await page.click(`#room-gift-item-list > li:nth-child(${num}) > a > img`);
  }
  await page.waitFor(2000);
}