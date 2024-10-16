import { PowerbodyWebAutomationConfig } from '../powerbody-connector.service';
import puppeteer from 'puppeteer';

export const downloadProductFeed = async (config: PowerbodyWebAutomationConfig) => {
  console.info('Puppeteer started')
  const browser = await puppeteer.launch({
    browser: 'chrome',
    headless: true,
    args: ['--no-sandbox'], // Use this option if you encounter sandbox issues
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1000, height: 800 });

  try {
    await page.goto('https://www.powerbody.eu/customer/account/login/');
    // Log in
    await page.type('#login', config.username);
    await page.type('#password', config.password);
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    page.click('.download-price-list a');
    console.info('Puppeteer File download begins')

    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './test-folder',
    });

    await page.waitForNetworkIdle({timeout: 6000}); // Wait until the download is complete

    console.info('file download was completed')
  } catch (e) {
    console.error(
      'something went wrong while getting latest powerbody file',
      e,
    );
  } finally {
    await page.close()
    await browser.close();
  }
};

