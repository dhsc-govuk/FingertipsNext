import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PopulationDataTable } from './PopulationDataTable';

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

describe('PopulationDataTable', () => {
  test('renders table with correct headers and data', () => {
    render(
      <PopulationDataTable
        headers={['Age Band', 'Females', 'Males']}
        title="Population Data"
        healthDataForArea={mockHealthDataForArea}
      />
    );

    expect(screen.getByText('Population Data')).toBeInTheDocument();
    expect(screen.getByText('Age Band')).toBeInTheDocument();
    expect(screen.getByText('Females')).toBeInTheDocument();
    expect(screen.getByText('Males')).toBeInTheDocument();
    expect(screen.getByText('0-4')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();
  });

  test('renders empty when no data is provided', () => {
    const { container } = render(
      <PopulationDataTable
        headers={['Age Band', 'Females', 'Males']}
        title="Population Data"
        healthDataForArea={undefined}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('take a snapshot', () => {
    const { asFragment } = render(
      <PopulationDataTable
        headers={['Age Band', 'Females', 'Males']}
        title="Population Data"
        healthDataForArea={mockHealthDataForArea}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
