import type { Page as PlaywrightPage } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './pageFactory';
export default class BasePage {
  constructor(public readonly page: PlaywrightPage) {}

  async waitForURLToContain(containsURL: string) {
    await this.page.waitForURL(new RegExp(containsURL));
  }

  async expectNoAccessibilityViolations(axeBuilder: AxeBuilder) {
    expect((await axeBuilder.analyze()).violations).toEqual([]);
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
