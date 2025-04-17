import { render, screen } from '@testing-library/react';
import { ViewsWrapper } from '.';
import {
  generateMockAreaHealthData,
  generateMockHealthDataPoint,
  generateMockIndicatorWithAreaHealthData,
} from './hasSufficientHealthDataCheck.test';

const TestComponent = () => {
  return (
    <>
      <p>Some child component</p>
    </>
  );
};

describe('ViewsWrapper', () => {
  it('should render the child component if there are healthData for the selected areas', () => {
    const mockIndicatorsDataForAreas = [
      generateMockIndicatorWithAreaHealthData(1, [
        generateMockAreaHealthData('A001', [
          generateMockHealthDataPoint(2022),
          generateMockHealthDataPoint(2021),
        ]),
      ]),
    ];

    render(
      <ViewsWrapper
        areaCodes={['A001']}
        indicatorsDataForAreas={mockIndicatorsDataForAreas}
      >
        <TestComponent />
      </ViewsWrapper>
    );

    expect(screen.getByText('Some child component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('no-health-data-message')
    ).not.toBeInTheDocument();
  });

  it('should render "No data" if there are no healthData for all the selected areas', () => {
    const mockIndicatorsDataForAreas = [
      generateMockIndicatorWithAreaHealthData(1, [
        generateMockAreaHealthData('A001'),
      ]),
    ];

    render(
      <ViewsWrapper
        areaCodes={['A002']}
        indicatorsDataForAreas={mockIndicatorsDataForAreas}
      >
        <TestComponent />
      </ViewsWrapper>
    );

    expect(screen.queryByText('Some child component')).not.toBeInTheDocument();
    expect(screen.getByTestId('no-health-data-message')).toBeInTheDocument();
  });
});
