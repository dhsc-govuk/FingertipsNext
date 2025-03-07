
// should have a grey row colour for benchmark data
// should display x in cells with undefined data


import { render, screen } from '@testing-library/react';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable/index';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { expect } from '@jest/globals';


describe('BarChartEmbeddedTable', () => {
  const mockHealthIndicatorData = [{
    areaCode: 'A1425',
    areaName: 'Greater Manchester ICB - 00T',
    healthData: [
      {
        year: 2008,
        count: 222,
        value: 890.305692,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        year: 2004,
        count: 267,
        value: 703.420759,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
    ],
  }];

  const mockBenchmarkData = {
    areaCode: 'E92000001',
    areaName: 'England',
    healthData: [
      {
        year: 2004,
        count: 200,
        value: 904.874,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '0-4',
        sex: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        year: 2008,
        count: 500,
        value: 965.9843,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '10-14',
        sex: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
    ],
  };

  it('should render BarChartEmbeddedTable component', () => {

    render(<BarChartEmbeddedTable healthIndicatorData={mockHealthIndicatorData} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('barChartEmbeddedTable-component')).toBeInTheDocument();
  });
  
  it('should always display benchmark data in the first table row of data', () => {
    
    render(<BarChartEmbeddedTable healthIndicatorData={mockHealthIndicatorData} benchmarkData={mockBenchmarkData} />);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('England');
  });
  
  it('should order the data displayed by largest value', () => {

    render(<BarChartEmbeddedTable healthIndicatorData={mockHealthIndicatorData} />);
    // get header by role
    // find column with heading value
    // loop through the rows of value column
    // sort through the values
    // expect them to be sorted
    
    const header = screen.getAllByRole('columnheader');
    const valueColumnIndex = header.findIndex((item) => item.textContent?.includes('Value'));
    const areaRows = screen.getAllByRole('row').slice(2);
    const cells = screen.getAllByRole('cell');
    
    const values =  areaRows.map((item) => {
      return parseInt(String(cells[valueColumnIndex].textContent || 0));
    })
    
    const sortedValues = values.sort((a, b) => b - a);
    expect(values).toEqual(sortedValues);
  });
  
});