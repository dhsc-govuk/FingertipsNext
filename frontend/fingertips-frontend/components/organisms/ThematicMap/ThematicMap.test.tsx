import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from '.';
import { getMapData } from '@/lib/chartHelpers/thematicMapHelpers';

const mockAreaType = 'regions';
const mockAreaCodes = ['E12000001', 'E12000002'];
const mockMapData = getMapData(mockAreaType, mockAreaCodes);

it('should render the ThematicMap title', async () => {
  render(
    <ThematicMap
      healthIndicatorData={mockHealthData['92420']}
      mapData={mockMapData}
      mapTitle="valid title"
    />
  );

  const title = await screen.findByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('valid title');
});

it('should render the ThematicMap component', async () => {
  render(
    <ThematicMap
      healthIndicatorData={mockHealthData['92420']}
      mapData={mockMapData}
      mapTitle="valid title"
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-thematicMap-component'
  );
  expect(highcharts).toBeInTheDocument();
});
