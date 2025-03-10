import { render, screen } from '@testing-library/react';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { GroupAreaSelectedPill } from '.';
import { userEvent } from '@testing-library/user-event';

describe('GroupAreaSelectedPill', () => {
  const mockRemoveFilter = jest.fn();
  const area = mockAreaDataForNHSRegion[eastEnglandNHSRegion.code];
  const areaTypeName = 'NHS Primary Care Network';

  beforeEach(() => {
    mockRemoveFilter.mockClear();
  });

  it('should render the GroupAreaSelectedPill correctly', () => {
    render(
      <GroupAreaSelectedPill
        areaTypeName={areaTypeName}
        groupSelected={area}
        onRemoveFilter={mockRemoveFilter}
      />
    );

    expect(screen.getByText(`All areas in ${area.name}`)).toBeInTheDocument();
    expect(screen.getByText(areaTypeName)).toBeInTheDocument();
  });

  it('should call onRemoveFilter when the pill is clicked', async () => {
    render(
      <GroupAreaSelectedPill
        areaTypeName={areaTypeName}
        groupSelected={area}
        onRemoveFilter={mockRemoveFilter}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId('remove-icon-div'));
    expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
    expect(mockRemoveFilter).toHaveBeenCalledWith(area.code);
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <GroupAreaSelectedPill
        areaTypeName={areaTypeName}
        groupSelected={area}
        onRemoveFilter={mockRemoveFilter}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
