import { render } from '@testing-library/react';
import { AreaAutoCompletePillPanel } from './index';

describe('Test AreaSelectionSearchPillPanel', () => {
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

  it('test that can pill can be deleted when the close button is clicked', () => {});
});
