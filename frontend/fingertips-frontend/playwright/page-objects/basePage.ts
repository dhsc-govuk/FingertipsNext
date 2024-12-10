import type { Page as PlaywrightPage } from 'playwright-core';
import { expect } from '@playwright/test';

export default class BasePage {
  constructor(public readonly page: PlaywrightPage) {}

  async checkURL(checkURL: string) {
    await expect(this.page).toHaveURL(checkURL);
  }

  async navigateTo(page: string) {
    //Variables for retry logic
    let retryAttempt = 0;
    const maxRetries = 3;

    let pageNavigation;
    //Retry logic for page navigation
    while (retryAttempt < maxRetries) {
      try {
        pageNavigation = await this.page.goto(page);
        break;
      } catch (error) {
        retryAttempt++;
        //Throw error if max retries reached
        if (retryAttempt === maxRetries) {
          throw new Error(error + 'Page navigation failed');
        }
      }
    }
    await this.page.waitForLoadState();
    return pageNavigation;
  }
}
