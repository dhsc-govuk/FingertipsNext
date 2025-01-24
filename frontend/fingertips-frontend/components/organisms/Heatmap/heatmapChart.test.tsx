import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  HeatmapChart,
  IndicatorRowData,
} from '@/components/organisms/Heatmap/index';

const areaCodes: Array<string> = ['area1', 'area2', 'area3'];
const heatmapData: Array<IndicatorRowData> = [
  {
    indicator: 'Indicator1',
    year: 2023,
    rowData: [
      {
        areaCode: 'area1',
        healthData: [
          {
            year: 2023,
            count: 3,
            value: 27,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
          },
        ],
      },
    ],
  },
];

it('should render the Highcharts react component within the HeatmapChart component ', () => {
  render(
    <HeatmapChart
      data={heatmapData}
      areaCodes={areaCodes}
      accessibilityLabel="A heatmap chart showing healthcare data"
    />
  );
  
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

it('should render the Heatmap title', () => {
  render(
    <HeatmapChart
      data={heatmapData}
      areaCodes={areaCodes}
      accessibilityLabel="A heatmap chart showing healthcare data"
    />
  );

  const title = screen.getByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('Heatmap Chart Title');
});
