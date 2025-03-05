import { render, screen } from '@testing-library/react';
import { AreaSelectedPill } from './index';
import { userEvent } from '@testing-library/user-event';
import { AreaTypeKeys, gpsAreaType } from '@/lib/areaFilterHelpers/areaType';

describe('AreaSelectedPill', () => {
  const mockRemoveFilter = jest.fn();
  const area = {
    code: '123',
    name: 'Test Area',
    typeName: gpsAreaType.name,
    typeKey: gpsAreaType.key as AreaTypeKeys,
  };

  beforeEach(() => {
    mockRemoveFilter.mockClear();
  });

  it('should render the AreaSelectedPill correctly', () => {
    render(
      <AreaSelectedPill
        areaName={area.name}
        areaCode={area.code}
        areaTypeKey={area.typeKey}
        areaTypeName={area.typeName}
        onRemoveFilter={mockRemoveFilter}
      />
    );
    expect(screen.getByText('123 - Test Area')).toBeInTheDocument();
    expect(screen.getByText(gpsAreaType.name)).toBeInTheDocument();
  });

  it('should call onRemoveFilter when the pill is clicked', async () => {
    render(
      <AreaSelectedPill
        areaName={area.name}
        areaCode={area.code}
        areaTypeKey={area.typeKey}
        areaTypeName={area.typeName}
        onRemoveFilter={mockRemoveFilter}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId('remove-icon-div'));
    expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
    expect(mockRemoveFilter).toHaveBeenCalledWith('123');
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <AreaSelectedPill
        areaName={area.name}
        areaCode={area.code}
        areaTypeKey={area.typeKey}
        areaTypeName={area.typeName}
        onRemoveFilter={mockRemoveFilter}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
