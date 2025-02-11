import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from '.';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';

const mockAreaType = 'Regions Statistical';
const mockAreaCodes = ['E12000001', 'E12000002'];
const mockMapData = getMapData(mockAreaType, mockAreaCodes).mapFile;
const mockMapJoinKey = getMapData(mockAreaType, mockAreaCodes).mapJoinKey;
const mockMapGroup = getMapData(mockAreaType, mockAreaCodes).mapGroupBoundary;

it('should render the ThematicMap title', async () => {
  render(
    <ThematicMap
      data={mockHealthData['318']}
      mapData={mockMapData}
      mapJoinKey={mockMapJoinKey}
      mapGroupBoundary={mockMapGroup}
      mapTitle="valid title"
    />
  );

  const title = await screen.findByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('valid title');
});

it('should render the ThematicMap component', async () => {
  render(
    <ThematicMap
      data={mockHealthData['318']}
      mapData={mockMapData}
      mapJoinKey={mockMapJoinKey}
      mapGroupBoundary={mockMapGroup}
      mapTitle="valid title"
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-thematicMap-component'
  );
  expect(highcharts).toBeInTheDocument();
});
