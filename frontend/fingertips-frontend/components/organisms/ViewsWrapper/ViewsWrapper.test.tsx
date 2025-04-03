import { render, screen } from '@testing-library/react';
import { ViewsWrapper } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import {
  generateMockAreaHealthData,
  generateMockIndicatorWithAreaHealthData,
} from './hasHealthDataCheck.test';

const TestComponent = () => {
  return (
    <>
      <p>Some child component</p>
    </>
  );
};

describe('ViewsWrapper', () => {
  it('should render the child component if there are healthData for the selected areas', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A001'],
    };

    const mockIndicatorsDataForAreas = [
      generateMockIndicatorWithAreaHealthData(1, [
        generateMockAreaHealthData('A001'),
      ]),
    ];

    render(
      <ViewsWrapper
        searchState={searchState}
        indicatorsDataForAreas={mockIndicatorsDataForAreas}
      >
        <TestComponent />
      </ViewsWrapper>
    );

    expect(screen.getByText('Some child component')).toBeInTheDocument();
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });

  it('should render "No data" if there are no healthData for all the selected areas', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A002'],
    };

    const mockIndicatorsDataForAreas = [
      generateMockIndicatorWithAreaHealthData(1, [
        generateMockAreaHealthData('A001'),
      ]),
    ];

    render(
      <ViewsWrapper
        searchState={searchState}
        indicatorsDataForAreas={mockIndicatorsDataForAreas}
      >
        <TestComponent />
      </ViewsWrapper>
    );

    expect(screen.queryByText('Some child component')).not.toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
