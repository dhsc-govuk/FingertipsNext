import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesForSingleTimePeriod } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, maleSex } from '@/lib/mocks';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const mockSearchState = {
  [SearchParams.InequalityYearSelected]: '2008',
};

describe('InequalitiesForSingleTimePeriod suite', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue(mockSearchState);
  });

  it('should render expected elements', async () => {
    const years = ['2008', '2004'];
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: [
        ...MOCK_HEALTH_DATA[0].healthData,
        {
          year: 2008,
          count: 267,
          value: 703.420759,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: allAgesAge,
          sex: maleSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          isAggregate: false,
        },
      ],
    };

    render(
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={mockHealthData}
        searchState={mockSearchState}
      />
    );

    const dropDown = screen.getByRole('combobox');
    const yearOptions = within(dropDown).getAllByRole('option');

    expect(
      screen.getByTestId('inequalitiesBarChartTable-component')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('inequalitiesBarChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Inequalities data for a single time period/i)
    ).toBeInTheDocument();
    expect(dropDown).toBeInTheDocument();
    expect(dropDown).toHaveLength(2);
    yearOptions.forEach((option, index) => {
      expect(option.textContent).toBe(years[index]);
    });
  });

  it('should not render component if inequalities data is absent', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
    };

    render(
      <InequalitiesForSingleTimePeriod
        healthIndicatorData={mockHealthData}
        searchState={mockSearchState}
      />
    );

    expect(
      screen.queryByTestId('inequalitiesForSingleTimePeriod-component')
    ).not.toBeInTheDocument();
  });
});
