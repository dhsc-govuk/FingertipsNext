// does the table display england data in the top row
// does the table order the areas selected data by the largest value
// should render the bar chart table component 
// should render the expected headers
// should have a grey row colour for benchmark data
// should display x in cells with undefined data


import { render, screen } from '@testing-library/react';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable/index';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';


describe('BarChartEmbeddedTable', () => {
  const mockHealthIndicatorData = [ {
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
  }]
  
  it('should render BarChartEmbeddedTable component', () => {
    
    render(<BarChartEmbeddedTable healthIndicatorData={
      mockHealthIndicatorData}/>)});
  
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByTestId('barChartEmbeddedTable-component')).toBeInTheDocument();
  
})