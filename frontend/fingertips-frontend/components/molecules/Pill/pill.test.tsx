import { render, screen } from '@testing-library/react';
import { Pill } from '.';
import { userEvent } from '@testing-library/user-event';

const mockFilterRemoveFunction = vi.fn();
const selectedFilterName = 'Dementia';
const selectedFilterId = '001';

const renderPill = (flags: { asViewOnly: boolean } = { asViewOnly: false }) =>
  render(
    <Pill
      ariaLabelPostfix={'Some Test Area'}
      selectedFilterId={selectedFilterId}
      removeFilter={flags.asViewOnly ? undefined : mockFilterRemoveFunction}
    >
      {selectedFilterName}
    </Pill>
  );

describe('Pill Suite', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render expected elements', () => {
    renderPill();

    expect(screen.getByTestId('pill-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('remove-icon-div')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should not render close icon if view only', () => {
    renderPill({ asViewOnly: true });

    expect(screen.getByTestId('pill-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.queryByTestId('remove-icon-div')).not.toBeInTheDocument();
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
  });

  it('should render child text passed in as prop', () => {
    renderPill();
    expect(screen.getByText('Dementia')).toBeInTheDocument();
  });

  it('should call the passed in handle function when clicking the remove icon', async () => {
    const user = userEvent.setup();
    mockFilterRemoveFunction.mockClear();

    render(
      <Pill
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      >
        {selectedFilterName}
      </Pill>
    );

    await user.click(screen.getByTestId('remove-icon-div'));

    expect(mockFilterRemoveFunction).toHaveBeenCalledWith(selectedFilterId);
  });

  it('should not render the remove icon when no removeFilter function is provided', () => {
    render(<Pill>{selectedFilterName}</Pill>);

    expect(screen.queryByTestId('remove-icon-div')).not.toBeInTheDocument();
  });

  it('snapshot test', () => {
    const container = renderPill();
    expect(container.asFragment()).toMatchSnapshot();
  });
});
