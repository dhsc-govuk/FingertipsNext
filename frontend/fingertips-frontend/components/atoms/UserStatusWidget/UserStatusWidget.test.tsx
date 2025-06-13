import { render } from '@testing-library/react';
import { UserStatusWidget } from '.';

describe('auth status widget', () => {
  it('should render nothing if there is no user', () => {
    const screen = render(<UserStatusWidget user={undefined} />);

    expect(screen.container).toBeEmptyDOMElement();
  });

  it("should render the user's name if provided", () => {
    const expectedUserName = 'AzureDiamond';
    const screen = render(
      <UserStatusWidget user={{ name: expectedUserName }} />
    );

    expect(screen.getByText(expectedUserName)).toBeInTheDocument();
  });

  // to be replaced once design finalised on handling user images
  it('should render a user image', () => {
    const screen = render(<UserStatusWidget user={{ name: 'AzureDiamond' }} />);

    expect(screen.getByText('☺')).toBeInTheDocument();
  });
});
