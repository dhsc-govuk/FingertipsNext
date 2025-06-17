import type { Locator, Page as PlaywrightPage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './pageFactory';
import { SearchMode } from '../testHelpers/genericTestUtils';

export default class BasePage {
  readonly errorPageTitleHeaderId = 'error-page-title';

  constructor(public readonly page: PlaywrightPage) {}

  async waitForURLToContain(containsURL: string) {
    await this.page.waitForURL((url) => {
      return url.toString().toLowerCase().includes(containsURL.toLowerCase());
    });
  }

  async waitForURLToContainBasedOnSearchMode(
    searchMode: SearchMode,
    subjectSearchTerm: string,
    areaSearchCode: string
  ) {
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.waitForURLToContain(subjectSearchTerm);
    }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await this.waitForURLToContain(subjectSearchTerm);
      await this.waitForURLToContain(areaSearchCode);
    }
    if (searchMode === SearchMode.ONLY_AREA) {
      await this.waitForURLToContain(areaSearchCode);
    }
  }

  async clickAndAwaitLoadingComplete(locator: Locator, timeout?: number) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0, { timeout });

    await locator.click();

    await expect(this.page.getByText('Loading')).toHaveCount(0, { timeout });
    await this.page.waitForLoadState();
  }

  async checkAndAwaitLoadingComplete(locator: Locator) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await locator.check();

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
  }

  async uncheckAndAwaitLoadingComplete(locator: Locator) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await locator.uncheck();

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
  }

  async fillAndAwaitLoadingComplete(locator: Locator, value: string) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await locator.fill(value);

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
  }

  async clearAndAwaitLoadingComplete(locator: Locator) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await locator.clear();

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
  }

  async selectOptionAndAwaitLoadingComplete(locator: Locator, option: string) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await locator.selectOption(option);

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
  }

  async expectNoAccessibilityViolations(
    axeBuilder: AxeBuilder,
    allowList: string[] = []
  ): Promise<void> {
    // Apply rule disabling if allowList is provided
    if (allowList.length > 0) {
      axeBuilder = axeBuilder.disableRules(allowList);
    }

    const results = await axeBuilder.analyze();

    expect(results.violations).toEqual([]);
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

  errorPageTitle() {
    return this.page.getByTestId(this.errorPageTitleHeaderId);
  }
}
