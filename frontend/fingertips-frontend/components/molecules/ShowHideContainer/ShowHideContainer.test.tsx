import { render, screen } from '@testing-library/react';
import { ShowHideContainer } from '.';
import userEvent from '@testing-library/user-event';
import { Button } from 'govuk-react';

const mockOnToggleContainer = jest.fn();

describe('ShowHideContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not show the side bar when showSideBarWhenOpen is false', () => {
    /**
     * In the snapshot you will still the following style
     * .c1 div {
     *   border-left: none;
     * }
     * This indicates the sidebar was not rendered
     */

    const container = render(
      <ShowHideContainer
        summary="Some summary"
        showSideBarWhenOpen={false}
        onToggleContainer={mockOnToggleContainer}
      >
        <div data-testid="inner-component">Some child element</div>
      </ShowHideContainer>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should not show the side bar when showSideBarWhenOpen is true', () => {
    /**
     * In the snapshot you will still the following style
     * .c1 div {
     *   border-left: 5px #A1A2A3 solid;
     *   padding-left: 1em;
     * }
     * This indicates the sidebar was rendered
     */

    const container = render(
      <ShowHideContainer
        summary="Some summary"
        showSideBarWhenOpen={true}
        onToggleContainer={mockOnToggleContainer}
      >
        <div data-testid="inner-component">Some child element</div>
      </ShowHideContainer>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should call the provided onToggleContainer function when the label is clicked', async () => {
    render(
      <ShowHideContainer
        summary="Some summary"
        showSideBarWhenOpen={true}
        onToggleContainer={mockOnToggleContainer}
      >
        <div data-testid="inner-component">Some child element</div>
      </ShowHideContainer>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Some summary'));

    expect(mockOnToggleContainer).toHaveBeenCalled();
  });

  it('should not call the provided onToggleContainer function when an element on the child component is clicked in order to prevent event propagation', async () => {
    render(
      <ShowHideContainer
        summary="Some summary"
        showSideBarWhenOpen={true}
        onToggleContainer={mockOnToggleContainer}
      >
        <div data-testid="inner-component">
          <Button>Some button</Button>
        </div>
      </ShowHideContainer>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Some button'));

    expect(mockOnToggleContainer).not.toHaveBeenCalled();
  });
});
