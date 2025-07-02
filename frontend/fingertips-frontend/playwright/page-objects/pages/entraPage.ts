import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class EntraPage extends BasePage {
  readonly entraWelcomeText = 'Sign in to access ';
  readonly emailAriaLabel = 'Enter your email address';
  readonly passwordAriaLabel = 'Enter the password for ';
  readonly incorrectPasswordMessage = `We couldn't find an account with this email address or password.`;

  async checkOnEntraSignInPage() {
    await expect(this.page.getByText(this.entraWelcomeText)).toBeVisible();
  }

  async checkIncorrectPasswordMessageIsDisplayed() {
    await expect(
      this.page.getByText(this.incorrectPasswordMessage)
    ).toBeVisible();
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
