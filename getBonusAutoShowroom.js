'use strict';

require("dotenv").config();

const puppeteer = require('puppeteer-core');

const option = {
  executablePath: process.env.chromePath,
  // headless: false,
  args: [
    "--lang=ja",
    "--window-size=1260,900",
    // '--no-sandbox',
  ],
};

console.log(new Date().toString({ timeZone: 'Asia/Tokyo'}));

puppeteer.launch(option).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1260, height: 900 });

  // ログインまで
  await page.goto('https://www.showroom-live.com/onlive');
  await page.waitFor(3000);
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
  await page.waitFor(3000);
  await page.click('#js-login-submit');
  console.log('Signin!');

  await page.waitFor(3000);

  const rooms = await page.evaluate(() => {
    
    const roomLength = 20;

    const li = document.querySelectorAll("#js-onlive-collection > div > section > ul > li > div > div.onlivecard-overview > a.js-room-link.onlivecard-join-btn");
    const array = [];
    for (let i = 0; i < roomLength; i++) {
      array.push(li[i].href);
    }
    return array;
  });

  console.log(rooms);

  // ルームへ入って星を取得
  for (var j = 0; j < rooms.length;j++) {
    try {
      console.log(rooms[j]);
      await page.goto(rooms[j]);
      await page.waitForSelector('#room-gift-item-list > li:nth-child(2) > div', { timeout: 10000 });
      
      const giftLength = await page.evaluate(() => 
        document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent
      );

      // 無料ギフトが99個あったら次のルームへ
      if (giftLength == '× 99'){
        continue;
      }

      // bonus取得まで待機
      await page.waitForSelector('#bonus > section > div.bonus-title', { timeout: 40000 });
      
      await page.waitFor(3000);
      console.log(await page.evaluate(() =>
        document.querySelector("#room-gift-item-list > li:nth-child(2) > div").textContent
      ));
      continue;

   } catch(e) {
     // 例外発生で次のルームへ
    continue;
   }
  };
  await page.close();
  await browser.close();
});
