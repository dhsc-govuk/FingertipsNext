import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { ThematicMap } from '.';
import { getMapGroupBoundary } from '@/lib/mapUtils/getMapGroupBoundary';
import { getMapData } from '@/lib/mapUtils/getMapData';

const mockAreaType = 'Regions Statistical';
const mockMapData = getMapFile(mockAreaType);
const mockMapJoinKey = getMapData(mockAreaType).mapJoinKey;

const mockMapGroup = getMapGroupBoundary(
  mockMapData,
  ['E12000001', 'E12000002'],
  mockMapJoinKey
);

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
