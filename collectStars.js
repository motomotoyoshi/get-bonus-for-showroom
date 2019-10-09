const
    puppeteer = require('puppeteer-core'),
    conf = require('./conf');

(async () => {
    const browser = await puppeteer.launch(
        {
            executablePath: conf.chromePath,
            headless: false,
            args:[
                '--lang=ja',
                '--window-size=1260,900',
            ]
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1260, height: 600});
    await page.goto('https://example.com');
    await page.waitForSelector('body');
    await page.waitFor(3000);

    await browser.close();
})();