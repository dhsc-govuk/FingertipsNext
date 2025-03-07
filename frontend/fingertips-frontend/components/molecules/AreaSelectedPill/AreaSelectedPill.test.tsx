import { render, screen } from '@testing-library/react';
import { AreaSelectedPill } from './index';
import { userEvent } from '@testing-library/user-event';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';

describe('AreaSelectedPill', () => {
  const mockRemoveFilter = jest.fn();
  const area = mockAreaDataForNHSRegion[eastEnglandNHSRegion.code];

  beforeEach(() => {
    mockRemoveFilter.mockClear();
  });

  it('should render the AreaSelectedPill correctly', () => {
    render(<AreaSelectedPill area={area} onRemoveFilter={mockRemoveFilter} />);
    expect(screen.getByText(area.name)).toBeInTheDocument();
    expect(screen.getByText(area.areaType.name)).toBeInTheDocument();
  });

  it('should call onRemoveFilter when the pill is clicked', async () => {
    render(<AreaSelectedPill area={area} onRemoveFilter={mockRemoveFilter} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId('remove-icon-div'));
    expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
    expect(mockRemoveFilter).toHaveBeenCalledWith(area.code);
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <AreaSelectedPill area={area} onRemoveFilter={mockRemoveFilter} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
