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
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      >
        {selectedFilterName}
      </Pill>
    );

    expect(screen.getByTestId('pill-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('remove-icon-div')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should render child text passed in as prop', () => {
    render(
      <Pill
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      >
        {selectedFilterName}
      </Pill>
    );
    expect(screen.getByText('Dementia')).toBeInTheDocument()
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

  it('snapshot test', () => {
    const container = render(
      <Pill
        selectedFilterId={selectedFilterId}
        removeFilter={mockFilterRemoveFunction}
      >
        {selectedFilterName}
      </Pill>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
