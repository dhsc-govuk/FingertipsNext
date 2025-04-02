import { render, screen, fireEvent } from '@testing-library/react';
import { PopulationPyramidWithTable } from './index';
import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { mockHealthData } from '@/mock/data/healthdata';
import '@testing-library/jest-dom';
import { AreaDocument } from '@/lib/search/searchTypes';
import { disaggregatedAge, femaleSex, noDeprivation } from '@/lib/mocks';

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

const mockHealthDataPoint: HealthDataPoint[] = [
  {
    year: 2025,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('0-4'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('5-9'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
];

// Mock dependencies
jest.mock('@/components/organisms/PopulationPyramid', () => ({
  PopulationPyramid: () => <div data-testid="population-pyramid"></div>,
}));
jest.mock('@/components/molecules/SelectInputField', () => ({
  AreaSelectInputField: ({
    onSelected,
  }: {
    onSelected: (area: Omit<AreaDocument, 'areaType'>) => void;
  }) => (
    <button
      data-testid="select-input"
      onClick={() => onSelected({ areaCode: '123', areaName: 'Test Area' })}
    >
      Select Area
    </button>
  ),
}));

describe('PopulationPyramidWithTable', () => {
  const setupUI = (dataForArea: HealthDataForArea[]) => {
    return render(
      <PopulationPyramidWithTable
        healthDataForAreas={dataForArea}
        groupAreaSelected="123"
        searchState={{}}
        xAxisTitle="Age"
        yAxisTitle="Percentage of population"
      />
    );
  };
  const mockHealthDataForArea: HealthDataForArea[] = [
    {
      areaCode: '123',
      areaName: 'Test Area',
      healthData: mockHealthDataPoint,
    },
    {
      areaCode: '124',
      areaName: 'Test Area',
      healthData: mockHealthDataPoint,
    },
  ];

  test('renders component with default title', () => {
    setupUI(mockHealthDataForArea);
    expect(screen.getByText('Related Population Data')).toBeInTheDocument();
  });

  test('renders tabs correctly', () => {
    const container = setupUI(mockHealthDataForArea);
    expect(screen.getByText('Show population data')).toBeInTheDocument();

    fireEvent.click(container.getByText('Show population data'));
    expect(screen.getByText('Hide population data')).toBeInTheDocument();
  });

  test('take a snapshot', () => {
    const container = render(
      <PopulationPyramidWithTable
        healthDataForAreas={mockHealthData['337']}
        groupAreaSelected={mockHealthData['337'][2].areaCode}
        searchState={{}}
        xAxisTitle="Age"
        yAxisTitle="Percentage of population"
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
