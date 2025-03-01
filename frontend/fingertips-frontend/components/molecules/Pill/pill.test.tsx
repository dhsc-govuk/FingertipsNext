import { render, screen } from '@testing-library/react';
import { Pill } from '.';
import { userEvent } from '@testing-library/user-event';

const mockFilterRemoveFunction = jest.fn();
const selectedFilterName = 'Dementia';
const selectedFilterId = '001';

describe('Pill Suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render expected elements', () => {
    render(
      <Pill
        selectedFilterName={selectedFilterName}
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      />
    );

    expect(screen.getByTestId('pill-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('remove-icon-div')).toBeInTheDocument();
    expect(screen.getByRole('paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should render text passed in as prop', () => {
    render(
      <Pill
        selectedFilterName={selectedFilterName}
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      />
    );

    expect(screen.getByRole('paragraph')).toHaveTextContent('Dementia');
  });

  it('should call the passed in handle function when clicking the remove icon', async () => {
    const user = userEvent.setup();
    mockFilterRemoveFunction.mockClear();

    render(
      <Pill
        selectedFilterName={selectedFilterName}
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      />
    );

    await user.click(screen.getByTestId('remove-icon-div'));

    expect(mockFilterRemoveFunction).toHaveBeenCalledWith(selectedFilterId);
  });

  it('snapshot test', () => {
    const container = render(
      <Pill
        selectedFilterName={selectedFilterName}
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
