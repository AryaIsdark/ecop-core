import puppeteer from 'puppeteer';
import { PowerbodyWebAutomationConfig } from '../powerbody-connector.service';

export const downloadProductFeed = async (config: PowerbodyWebAutomationConfig, tenantId: number) => {
  const browser = await puppeteer.launch({
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

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: `./tenants/${tenantId}/powerbody/product-feeds`,
    });

    await page.waitForNetworkIdle(); // Wait until the download is complete

    return 'succesfully downloaded the file'

  } catch (e) {
    console.error(
      'something went wrong while getting latest powerbody file',
      e,
    );
  } finally {
    await browser.close();
  }
};
