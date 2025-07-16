import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class EntraPage extends BasePage {
  readonly entraWelcomeText = 'Sign in to access ';
  readonly emailAriaLabel = 'Enter your email address';
  readonly passwordAriaLabel = 'Enter the password for ';
  readonly incorrectPasswordMessage = `We couldn't find an account with this email address or password.`;
  readonly unRegisteredEmailMessage = `We couldn't find an account with this email address.`;
  readonly createAccountText = 'Create account';

  async checkOnEntraSignInPage() {
    await expect(this.page.getByText(this.entraWelcomeText)).toBeVisible();
  }

  async checkOnCreateAccountPage() {
    await expect(this.page.getByText(this.createAccountText)).toBeVisible();
  }

  async checkIncorrectPasswordMessageIsDisplayed() {
    await expect(
      this.page.getByText(this.incorrectPasswordMessage)
    ).toBeVisible();
  }

  async checkUnRegisteredEmailMessageIsDisplayed() {
    await expect(
      this.page.getByText(this.unRegisteredEmailMessage)
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

  async clickCreateAccount() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('link', { name: 'No account? Create one' })
    );
  }

  async enterEmailAndPassword(email: string, password: string) {
    await this.typeEmail(email);
    await this.clickNext();
    await this.typePassword(password, email);
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
