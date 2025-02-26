import { render, screen } from '@testing-library/react';
import { AreaSearchPill } from './index';
import { userEvent } from '@testing-library/user-event';

describe('AreaSearchPill Component', () => {
  const mockRemoveFilter = jest.fn();
  const area = {
    areaCode: '123',
    areaName: 'Test Area',
    areaType: 'Urban',
  };

  beforeEach(() => {
    mockRemoveFilter.mockClear();
  });

  it('should render the AreaSearchPill correctly', () => {
    render(<AreaSearchPill area={area} onRemoveFilter={mockRemoveFilter} />);
    expect(screen.getByText('Test Area')).toBeInTheDocument();
    expect(screen.getByText('Urban')).toBeInTheDocument();
  });

  it('should call onRemoveFilter when the pill is clicked', async () => {
    render(<AreaSearchPill area={area} onRemoveFilter={mockRemoveFilter} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId('remove-icon-div'));
    expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
    expect(mockRemoveFilter).toHaveBeenCalledWith('123');
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <AreaSearchPill area={area} onRemoveFilter={mockRemoveFilter} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
