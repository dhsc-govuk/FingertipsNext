import type { Locator, Page as PlaywrightPage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './pageFactory';
import { SearchMode } from '../testHelpers/genericTestUtilities';
import { spaceSeparatedPattern } from '@/lib/constants';

export default class BasePage {
  readonly errorPageTitleHeaderId = 'error-page-title';
  readonly headerHomeLinkId = 'header-home-nav';
  readonly signInButton = 'sign-in-button';
  readonly signOutButton = 'sign-out-button';

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
    switch (searchMode) {
      case SearchMode.ONLY_SUBJECT:
        if (!subjectSearchTerm?.trim()) return;
        await this.waitForURLToContain(
          this.prepareSearchTermForURL(subjectSearchTerm)
        );
        break;

      case SearchMode.ONLY_AREA:
        if (!areaSearchCode?.trim()) return;
        await this.waitForURLToContain(areaSearchCode);
        break;

      case SearchMode.BOTH_SUBJECT_AND_AREA: {
        if (!subjectSearchTerm?.trim() || !areaSearchCode?.trim()) return;
        // Wait for both terms to appear in URL (potentially in any order)
        const preparedSubject = this.prepareSearchTermForURL(subjectSearchTerm);
        await Promise.all([
          this.waitForURLToContain(preparedSubject),
          this.waitForURLToContain(areaSearchCode),
        ]);
        break;
      }
    }
  }

  private prepareSearchTermForURL(searchTerm: string): string {
    let trimmed = searchTerm.trim();

    // Check if searched for text is a space-separated list of numbers
    if (spaceSeparatedPattern.test(trimmed)) {
      // replace whitespace with +
      trimmed = trimmed.replaceAll(' ', '+');
    }

    // handle ' common special character in search term
    return trimmed.replaceAll(/'/g, '%27');
  }

  async clickAndAwaitLoadingComplete(locator: Locator, timeout?: number) {
    await this.waitForLoadingToFinish(timeout);

    await locator.click();

    await this.waitForLoadingToFinish(timeout);
  }

  async checkAndAwaitLoadingComplete(locator: Locator) {
    await this.waitForLoadingToFinish();

    await locator.check();

    await this.waitForLoadingToFinish();
  }

  async uncheckAndAwaitLoadingComplete(locator: Locator) {
    await this.waitForLoadingToFinish();

    await locator.uncheck();

    await this.waitForLoadingToFinish();
  }

  async fillAndAwaitLoadingComplete(locator: Locator, value: string) {
    await this.waitForLoadingToFinish();

    await locator.fill(value);

    await this.waitForLoadingToFinish();
  }

  async clearAndAwaitLoadingComplete(locator: Locator) {
    await this.waitForLoadingToFinish();

    await locator.clear();

    await this.waitForLoadingToFinish();
  }

  async selectOptionAndAwaitLoadingComplete(locator: Locator, option: string) {
    await this.waitForLoadingToFinish();

    await locator.selectOption(option);

    await this.waitForLoadingToFinish();
  }

  async waitAfterDropDownInteraction() {
    await this.waitForLoadingToFinish();
    await this.page.waitForTimeout(1000);
  }

  async waitForLoadingToFinish(timeout?: number) {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0, { timeout });
  }

  async getSelectOptions(combobox: Locator) {
    return await combobox.evaluate((select: HTMLSelectElement) =>
      Array.from(select.options).map((option) => ({
        value: option.value,
        text: option.text,
      }))
    );
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

    // Retry logic for page navigation
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

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  async verifyUrlExcludesAllIndicators() {
    await expect(this.page).not.toHaveURL(/&is=/);
  }

  async verifyUrlUpdatedAfterDeselection(deselectedIndicator: string) {
    await expect(this.page).not.toHaveURL(
      new RegExp(`&is=${deselectedIndicator}`)
    );
  }

  async clickHeaderHomeNavigation() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.headerHomeLinkId)
    );
  }

  async clickSignIn() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.signInButton)
    );
  }

  async clickSignOut() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.signOutButton)
    );
  }

  async signInToMock(password: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByRole('textbox', { name: 'Password' }),
      password
    );

    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Sign in with password' })
    );
  }

  async checkSignInDisplayed() {
    await expect(this.page.getByTestId(this.signInButton)).toBeVisible();
  }

  async checkSignOutDisplayed() {
    await expect(this.page.getByTestId(this.signOutButton)).toBeVisible();
  }
}
