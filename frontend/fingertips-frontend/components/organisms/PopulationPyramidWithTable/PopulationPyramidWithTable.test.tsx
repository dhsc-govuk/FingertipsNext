import { render, screen, fireEvent } from '@testing-library/react';
import { PopulationPyramidWithTable } from './index';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { mockHealthData } from '@/mock/data/healthdata';
import '@testing-library/jest-dom';
import { AreaDocument } from '@/lib/search/searchTypes';

const mockHealthDataPoint = [
  {
    year: 2025,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '0-4',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
  },
  {
    year: 2023,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '5-9',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
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
  ];

  test('renders component with default title', () => {
    setupUI(mockHealthDataForArea);

    expect(screen.getByText('Related Population Data')).toBeInTheDocument();
    expect(screen.getByTestId('population-pyramid')).toBeInTheDocument();
  });

  test('updates title when area is selected', () => {
    setupUI(mockHealthDataForArea);

    fireEvent.click(screen.getByTestId('select-input'));

    expect(
      screen.getByText(/Resident population profile for Test Area 2025/)
    ).toBeInTheDocument();
  });

  test('renders tabs correctly', () => {
    setupUI(mockHealthDataForArea);

    expect(screen.getByText('Population pyramid')).toBeInTheDocument();
    expect(screen.getByText('Table')).toBeInTheDocument();
  });

  test('take a snapshot', () => {
    const pyramid = (
      <PopulationPyramidWithTable
        healthDataForAreas={mockHealthData['337']}
        selectedGroupAreaCode={mockHealthData['337'][1].areaCode}
        xAxisTitle="Age"
        yAxisTitle="Percentage of population"
      />
    );
    const container = render(pyramid);
    expect(container.asFragment()).toMatchSnapshot();
  });
});
