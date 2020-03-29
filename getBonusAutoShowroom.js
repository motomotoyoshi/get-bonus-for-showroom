'use strict';

const puppeteer = require('puppeteer-core');
const { chromePath, account_id, pass } = require('./conf');

const option = {
  executablePath: chromePath,
  // headless: false,
  args: [
    '--lang=ja',
    '--window-size=1260,900',
    // '--no-sandbox',
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

  await page.waitFor(3000);

  const rooms = await page.evaluate(() => {
    
    const roomLength = 20;

    const li = document.querySelectorAll("#js-onlive-collection > div > section > ul > li > div > div > div.listcard-image > div.listcard-overview > div > a.js-room-link.listcard-join-btn");
    const array = [];
    for (let i = 0; i < roomLength; i++) {
      array.push(li[i].href);
    }
    return array;
  });
  
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