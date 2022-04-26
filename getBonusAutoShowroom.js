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
  await page.waitForTimeout(2000);
  await page.click('#js-login-submit');
  console.log('Signin!');

  await page.waitForTimeout(2000);

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

      
  // const giftPath =
  //   "#__layout > div > div:nth-child(1) > div > div.st-gift_box.gift-box.active > div > div.gift-box-container > div.gifts-contaier > ul > li:nth-child(2) > div > p.num";
  // ルームへ入って星を取得
  for (var j = 0; j < rooms.length;j++) {

    try {
      console.log(rooms[j]);
      await page.goto(rooms[j]);

      const giftLength = await page.evaluate(() =>
        document
          .querySelector(
            "#__layout > div > div:nth-child(1) > div > div.st-gift_box.gift-box.active > div.gifts-contaier > ul > li:nth-child(2) > div > p.num"
          )
          .textContent.match(/\d{1,2}/)[0]
      );

      // 無料ギフトが99個あったら次のルームへ
      if (giftLength == '99'){
        continue;
      }

      // bonus取得まで待機
      await page.waitForTimeout(50000);
      console.log(
        await page.evaluate(() =>
          document
            .querySelector(
              "#__layout > div > div:nth-child(1) > div > div.st-gift_box.gift-box.active > div.gifts-contaier > ul > li:nth-child(2) > div > p.num"
            )
            .textContent.match(/\d{1,2}/)[0]
        )
      );
      continue;

   } catch(e) {
     // 例外発生で次のルームへ
    console.log(e)
    continue;
   }
  };
  await page.close();
  await browser.close();
});
