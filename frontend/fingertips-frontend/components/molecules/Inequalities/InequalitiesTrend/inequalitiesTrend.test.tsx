import { render, screen, within } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTrend } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { LoaderContext } from '@/context/LoaderContext';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, maleSex, noDeprivation } from '@/lib/mocks';

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

const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: jest.fn(),
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

describe('InequalitiesTrend suite', () => {
  it('should render expected elements', async () => {
    const inequalitiesOptions = ['Sex', 'Unitary deciles'];
    const mockHealthData: HealthDataForArea[] = [
      {
        ...MOCK_HEALTH_DATA[1],
        healthData: [
          ...MOCK_HEALTH_DATA[1].healthData,
          {
            year: 2008,
            count: 267,
            value: 703.420759,
            lowerCi: 441.69151,
            upperCi: 578.32766,
            ageBand: allAgesAge,
            sex: maleSex,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: {
              ...noDeprivation,
              isAggregate: false,
              type: 'Unitary deciles',
            },
            isAggregate: false,
          },
          {
            year: 2009,
            count: 300,
            value: 710.123456,
            lowerCi: 450.12345,
            upperCi: 580.12345,
            ageBand: allAgesAge,
            sex: maleSex,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: {
              ...noDeprivation,
              isAggregate: false,
              type: 'Unitary deciles',
            },
            isAggregate: false,
          },
        ],
      },
    ];
    render(
      <InequalitiesTrend
        healthIndicatorData={mockHealthData}
        dataSource="inequalities data source"
      />
    );

    const inequalitiesTypesDropDown = screen.getByRole('combobox', {
      name: 'Select an inequality type',
    });
    const inequalitiesDropDownOptions = within(
      inequalitiesTypesDropDown
    ).getAllByRole('option');

    const inequalitiesAreasDropDown = screen.getByRole('combobox', {
      name: 'Select an area',
    });
    const inequalitiesAreasDropDownOptions = within(
      inequalitiesAreasDropDown
    ).getAllByRole('option');

    expect(
      screen.getByTestId('inequalitiesLineChartTable-component')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('inequalitiesLineChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Inequalities data over time/i)
    ).toBeInTheDocument();

    expect(inequalitiesTypesDropDown).toBeInTheDocument();
    expect(inequalitiesDropDownOptions).toHaveLength(2);
    inequalitiesDropDownOptions.forEach((option, index) => {
      expect(option.textContent).toBe(inequalitiesOptions[index]);
    });

    expect(inequalitiesAreasDropDown).toBeInTheDocument();
    expect(inequalitiesAreasDropDownOptions).toHaveLength(1);
    inequalitiesAreasDropDownOptions.forEach((option) => {
      expect(option.textContent).toBe(MOCK_HEALTH_DATA[1].areaName);
    });

    expect(
      screen.getAllByText('Data source: inequalities data source')
    ).toHaveLength(2);
  });

  it('should not render component if inequalities data is absent', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
    };

    render(<InequalitiesTrend healthIndicatorData={[mockHealthData]} />);

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });

  it('should not render component if inequalities data has less than 2 data points', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: [MOCK_HEALTH_DATA[0].healthData[0]],
    };

    render(<InequalitiesTrend healthIndicatorData={[mockHealthData]} />);

    expect(
      screen.queryByTestId('inequalitiesTrend-component')
    ).not.toBeInTheDocument();
  });
});
