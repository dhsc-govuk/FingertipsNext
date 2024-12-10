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
    //Check if maxRetries is a valid number
    if (isNaN(maxRetries)) {
      throw new Error('Invalid navigation retries value');
    }
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
    return pageNavigation;
  }

  // checkA11Y = () => {
  //   return cy.a11y();
  // };
}
