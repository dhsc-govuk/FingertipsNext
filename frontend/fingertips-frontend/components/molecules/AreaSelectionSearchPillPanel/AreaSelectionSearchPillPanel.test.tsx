import { render, screen } from '@testing-library/react';
import { AreaAutoCompletePillPanel } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';
import { userEvent } from '@testing-library/user-event';
describe('Test AreaSelectionSearchPillPanel', () => {
  const areas: AreaDocument[] = [
    { areaCode: '001', areaName: 'London', areaType: 'GPs' },
    { areaCode: '002', areaName: 'Manchester', areaType: 'GPs' },
  ];
  const mockOnRemovePill = jest.fn();

  it('take a snapshot of component and it renders correctly', () => {
    const container = render(
      <AreaAutoCompletePillPanel
        areas={[
          {
            areaCode: 'GPs',
            areaName: 'Some gp practice here',
            areaType: 'some types information',
          },
        ]}
        onRemovePill={jest.fn()}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('calls onRemovePill when a pill button is clicked', async () => {
    render(
      <AreaAutoCompletePillPanel
        areas={areas}
        onRemovePill={mockOnRemovePill}
      />
    );
    const user = userEvent.setup();
    mockOnRemovePill.mockClear();
    const removeButtons = screen.getAllByTestId('remove-icon-div');
    for (let i = 0; i < areas.length; i++) {
      mockOnRemovePill.mockClear();
      await user.click(removeButtons[i]);
      expect(mockOnRemovePill).toHaveBeenCalledWith(areas[i]);
    }
  });
});
