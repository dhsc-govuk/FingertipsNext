import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class EntraPage extends BasePage {
  readonly entraWelcomeText = 'Sign in to access ';
  readonly emailAriaLabel = 'Enter your email address';
  readonly passwordAriaLabel = 'Enter the password for ';

  async checkOnEntraSignInPage() {
    await expect(this.page.getByText(this.entraWelcomeText)).toBeVisible();
  }

  async clickNoToNotStaySignedIn() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'No' })
    );
  }

  async clickNext() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Next' })
    );
  }

  async clickSignIn() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Sign in' })
    );
  }

  async enterEmailAndPassword(email: string, password: string) {
    await this.typeEmail(email);
    await this.clickNext();
    await this.typePassword(password, email);
    await this.clickSignIn();
    await this.clickNoToNotStaySignedIn();
  }

  async typeEmail(email: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.emailAriaLabel),
      email
    );
  }

  async typePassword(password: string, email: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.passwordAriaLabel + email),
      password
    );
  }
}
