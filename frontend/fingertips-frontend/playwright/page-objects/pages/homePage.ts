import {
  SearchMode,
  SignInAs,
} from '@/playwright/testHelpers/genericTestUtilities';
import type { Page as PlaywrightPage } from '@playwright/test';
import AreaFilter from '../components/areaFilter';
import { expect } from '../pageFactory';
import { siteTitle } from '@/lib/constants';
import EntraPage from './entraPage';

export default class HomePage extends AreaFilter {
  private readonly entraPage: EntraPage;

  constructor(page: PlaywrightPage) {
    // adjust constructor params as needed
    super(page);
    this.entraPage = new EntraPage(page);
  }

  readonly subjectSearchField = 'indicator-search-form-input';
  readonly searchButton = 'search-form-button-submit';
  readonly validationSummary = 'search-form-error-summary';
  readonly indicatorSearchButton = 'indicator-search-form-submit';
  readonly pillContainer = 'pill-container';
  readonly signInButton = 'sign-in-button';
  readonly signOutButton = 'sign-out-button';
  readonly email = 'fallback@email.com';
  readonly password =
    process.env.DEVELOPMENT_FINGERTIPS_E2E_AUTOMATION_PASSWORD || 'password';

  async searchForIndicators(
    searchMode: SearchMode,
    subjectSearchTerm?: string,
    areaSearchTerm?: string
  ) {
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );
    }
    if (searchMode === SearchMode.ONLY_AREA) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
        areaSearchTerm!
      );

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.clickAndAwaitLoadingComplete(
        this.page
          .getByTestId(this.suggestedAreasPanel)
          .getByText(areaSearchTerm!)
      );
    }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );

      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
        areaSearchTerm!
      );

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.clickAndAwaitLoadingComplete(
        this.page.getByText(areaSearchTerm!)
      );

      await expect(this.page.getByTestId(this.pillContainer)).toContainText(
        areaSearchTerm!,
        {
          ignoreCase: true,
        }
      );
    }
  }

  async clickHomePageFormSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.searchButton)
    );
  }

  async clickHomePageIndicatorSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchButton)
    );
  }

  async navigateToHomePage(queryString?: string) {
    if (queryString) {
      await this.navigateTo(`/${queryString}`);
    } else {
      await this.navigateTo('/');
    }
  }

  async checkOnHomePage() {
    await expect(
      this.page.getByRole('heading', { name: siteTitle }).first()
    ).toBeVisible();
  }

  async closeAreaFilterPill(index: number) {
    await this.page.waitForLoadState();

    const pills = await this.page.getByTestId(this.removeIcon).all();

    await this.clickAndAwaitLoadingComplete(pills[index]);
  }

  async checkSearchFieldIsPrePopulatedWith(indicator: string = '') {
    const fieldValue = await this.page
      .getByTestId(this.subjectSearchField)
      .inputValue();
    if (indicator) {
      expect(fieldValue).toEqual(indicator);
    } else expect(fieldValue).toBe('');
  }

  async clearSearchIndicatorField() {
    await this.clearAndAwaitLoadingComplete(
      this.page.getByTestId(this.subjectSearchField)
    );
  }

  async checkSummaryValidation(expectedValidationMessage: string) {
    await expect(this.page.getByTestId(this.validationSummary)).toHaveText(
      expectedValidationMessage
    );
  }

  async searchForArea(areaSearchTerm: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
      areaSearchTerm
    );
  }

  async checkAreaSuggestionPanelContainsAreas(expectedAreas: string[]) {
    await expect(
      this.page.getByTestId(this.suggestedAreasPanel).getByRole('listitem')
    ).toHaveCount(expectedAreas.length);
    expectedAreas.forEach(async (area, index) => {
      await expect(
        this.page
          .getByTestId(this.suggestedAreasPanel)
          .getByRole('listitem')
          .nth(index)
      ).toContainText(area);
    });
  }

  async clickSubjectSearchField() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.subjectSearchField)
    );
  }

  async clickSignInOnHomePage() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.signInButton)
    );
  }

  private determineSignInCredentials(signInRequired: SignInAs): {
    email: string;
    password: string;
  } {
    if (signInRequired.administrator) {
      return {
        email:
          process.env.DEVELOPMENT_FINGERTIPS_E2E_AUTOMATION_USERNAME_ADMIN ||
          this.email,
        password: this.password,
      };
    } else if (signInRequired.userWithIndicatorPermissions) {
      return {
        email:
          process.env
            .DEVELOPMENT_FINGERTIPS_E2E_AUTOMATION_USERNAME_ASSIGNED_INDICATORS ||
          this.email,
        password: this.password,
      };
    } else if (signInRequired.userWithoutIndicatorPermissions) {
      return {
        email:
          process.env
            .DEVELOPMENT_FINGERTIPS_E2E_AUTOMATION_USERNAME_NO_INDICATORS ||
          this.email,
        password: this.password,
      };
    } else {
      return {
        // this should never be used, but is a fallback that will correctly cause the test to fail if no sign in credentials are found
        email: this.email,
        password: this.password,
      };
    }
  }

  async signInIfRequired(signInRequired: SignInAs) {
    if (signInRequired) {
      const { email, password } =
        this.determineSignInCredentials(signInRequired);

      await this.clickSignInOnHomePage();

      await this.entraPage.checkOnEntraSignInPage();

      await this.entraPage.enterEmailAndPassword(email, password);

      await this.entraPage.clickSignIn();

      await this.checkSignOutDisplayed();
    }
  }

  async clickSignOut() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.signOutButton)
    );
  }

  async signInToMock() {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByRole('textbox', { name: 'Password' }),
      this.password
    );

    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Sign in with password' })
    );
  }

  async checkSignOutDisplayed() {
    await expect(this.page.getByTestId(this.signOutButton)).toBeVisible();
  }
}
