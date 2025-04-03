import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PopulationPyramidChartTable } from './index';

const mockHealthDataForArea = {
  areaName: 'Test Area',
  ageCategories: ['0-4', '5-9', '10-14', '15+'],
  femaleSeries: [10.0, 12.0, 11.0, 13.0],
  maleSeries: [9.0, 11.0, 10.5, 12.5],

  raw: {
    femaleSeries: [1000, 1200, 1100, 1300],
    maleSeries: [900, 1100, 1050, 1250],
  },
};

const mockBenchmarkData = {
  areaName: 'Benchmark Area',
  ageCategories: ['0-4', '5-9', '10-14', '15+'],
  femaleSeries: [],
  maleSeries: [],
  raw: {
    femaleSeries: [1100, 1300, 1200, 1400],
    maleSeries: [1100, 1200, 1150, 1350],
  },
};

const mockGroupData = {
  areaName: 'Group Area',
  ageCategories: ['0-4', '5-9', '10-14', '15+'],
  femaleSeries: [],
  maleSeries: [],
  raw: {
    femaleSeries: [1100, 1300, 1200, 1400],
    maleSeries: [100, 10, 1150, 150],
  },
};

describe('PopulationPyramidChartTable', () => {
  test('renders tables with health and benchmark data', () => {
    render(
      <PopulationPyramidChartTable
        healthDataForArea={mockHealthDataForArea}
        groupData={mockGroupData}
        benchmarkData={mockBenchmarkData}
      />
    );

    expect(screen.getByText('Test Area')).toBeInTheDocument();
    expect(screen.getByText('Group Area')).toBeInTheDocument();
    expect(screen.getByText('Benchmark: Benchmark Area')).toBeInTheDocument();
    expect(screen.getByText('0-4')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();
  });

  test('renders without benchmark data', () => {
    render(
      <PopulationPyramidChartTable
        healthDataForArea={mockHealthDataForArea}
        benchmarkData={undefined}
        groupData={mockGroupData}
      />
    );

    expect(screen.getByText('Test Area')).toBeInTheDocument();
    expect(
      screen.queryByText('Benchmark: Benchmark Area')
    ).not.toBeInTheDocument();
  });

  test('take a snapshot', () => {
    const { asFragment } = render(
      <PopulationPyramidChartTable
        healthDataForArea={mockHealthDataForArea}
        benchmarkData={mockBenchmarkData}
        groupData={mockGroupData}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
