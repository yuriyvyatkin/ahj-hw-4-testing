import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should add "valid" class for valid input', async () => {
    await page.goto(baseUrl);
    const input = await page.$('#card-number');
    const submit = await page.$('#submitform');
    await input.type('4388529697885');
    submit.click();
    await page.waitForSelector('.valid');
  });

  test('should add "invalid" class for invalid input', async () => {
    await page.goto(baseUrl);
    const input = await page.$('#card-number');
    const submit = await page.$('#submitform');
    await input.type('1111111111111111');
    submit.click();
    await page.waitForSelector('.invalid');
  });
});
