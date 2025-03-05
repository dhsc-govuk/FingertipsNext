import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const lineChartTestId = 'lineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'See how the indicator has changed over time';

const assertLineChartAndTableInDocument = async () => {
  expect(await screen.findByTestId(lineChartTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartTableTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartContainerTestId)).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: lineChartContainerTitle,
    })
  ).toBeInTheDocument();
};

const assertLineChartAndTableNotInDocument = () => {
  expect(screen.queryByTestId(lineChartTestId)).not.toBeInTheDocument();
  expect(screen.queryByTestId(lineChartTableTestId)).not.toBeInTheDocument();
  expect(
    screen.queryByTestId(lineChartContainerTestId)
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole('heading', {
      name: lineChartContainerTitle,
    })
  ).not.toBeInTheDocument();
};

describe('OneIndicatorTwoOrMoreAreasViewPlots', () => {
  it('should render the view with correct title', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
        searchState={searchState}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(
      screen.getByTestId('oneIndicatorTwoOrMoreAreasViewPlots-component')
    ).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the LineChart components when there are only 2 areas', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001', 'A002'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
        searchState={searchState}
      />
    );

    assertLineChartAndTableInDocument();
  });

  it('should not render the LineChart components when there are more than 2 areas', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001', 'A002', 'A003'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
        searchState={searchState}
      />
    );

    assertLineChartAndTableNotInDocument();
  });

  it('should not display LineChart components when there are less than 2 time periods per area selected', () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['0'],
      [SearchParams.AreasSelected]: ['A001'],
    };

    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={MOCK_DATA}
        searchState={state}
      />
    );

    assertLineChartAndTableNotInDocument();
  });
});
