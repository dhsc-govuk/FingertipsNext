import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { getMapJoinKey } from '@/lib/mapUtils/getMapJoinKey';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { getMapGroup } from '@/lib/mapUtils/getMapGroup';
import { ThematicMap } from '.';

it('should render the map title', async () => {
  const areaType = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  const mapGroup = getMapGroup(mapData, ['E08000025'], mapJoinKey);
  render(
    <ThematicMap
      data={mockHealthData['318']}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
      mapTitle="valid title"
    />
  );

  const title = await screen.findByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('valid title');
});

it('should render the ThematicMap component', async () => {
  const areaType = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  const mapGroup = getMapGroup(mapData, ['E08000025'], mapJoinKey);
  render(
    <ThematicMap
      data={mockHealthData['318']}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
      mapTitle="valid title"
    />
  );

  const highcharts = await screen.findByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});
