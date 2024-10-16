import { PowerbodyWebAutomationConfig } from '../powerbody-connector.service';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to wait for a file to be fully downloaded
async function waitForFile(downloadPath: string, timeout: number = 30000): Promise<string | null> {
  const startTime = Date.now();
  let fileName: string | null = null;

  while ((Date.now() - startTime) < timeout) {
    const files = fs.readdirSync(downloadPath); // Read the files in the download directory
    if (files.length > 0) {
      fileName = files.find(file => file.endsWith('.xls')); // Assuming the file ends in .csv
      if (fileName) {
        const filePath = path.join(downloadPath, fileName);
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          return filePath; // Return the full file path once the download completes
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second
  }

  console.error('File download timed out.');
  return null;
}

export const downloadProductFeed = async (config: PowerbodyWebAutomationConfig, downloadPath: string): Promise<string | null> => {
  console.info('Puppeteer started');
  let browser, page;
  try {
    browser = await puppeteer.launch({
      headless: 'shell',
      dumpio: true,
      args: ['--no-sandbox']
    });
    page = await browser.newPage();
    page.setViewport({ width: 1000, height: 800 });

    await page.goto('https://www.powerbody.eu/customer/account/login/');
    // Log in
    await page.type('#login', config.username);
    await page.type('#password', config.password);
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    // Set download behavior
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath,
    });

    // Click on the download link
    console.info('Puppeteer File download begins');
    await page.click('.download-price-list a');
    console.info('Waiting for the file to be fully downloaded...');

    // Wait for the download to complete by monitoring the downloadPath
    const downloadedFilePath = await waitForFile(downloadPath);

    if (downloadedFilePath) {
      console.info('Download completed successfully:', downloadedFilePath);
    
      return downloadedFilePath;
    } else {
      console.error('Download failed or timed out.');
      return null;
    }

  } catch (e) {
    console.error('Something went wrong while downloading the Powerbody file:', e);
    if (page) await page.close();
    if (browser) await browser.close();
    return null;
  }
};
