import type { Page as PlaywrightPage } from 'playwright-core';
import { expect } from '@playwright/test';

export default class BasePage {
  constructor(public readonly page: PlaywrightPage) {}

  async checkURLMatches(checkURL: string) {
    await expect(this.page).toHaveURL(checkURL);
  }

  async waitForURLToContain(containsURL: string) {
    await this.page.waitForURL(new RegExp(containsURL));
  }

  async navigateTo(page: string) {
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
        if (retryAttempt === maxRetries) {
          throw new Error(error + 'Page navigation failed');
        }
      }
    }
    await this.page.waitForLoadState();
    return pageNavigation;
  }
}
