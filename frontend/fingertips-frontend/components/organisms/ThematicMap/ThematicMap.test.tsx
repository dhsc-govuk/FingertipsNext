import { render, screen } from '@testing-library/react';
import { ThematicMap } from '.';
import { mockHealthData } from '@/mock/data/healthdata';
import { getMapJoinKey } from '@/lib/mapUtils/getMapJoinKey';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { getMapGroup } from '@/lib/mapUtils/getMapGroup';

it('should render the map title', () => {
  const areaType = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  const mapGroup = getMapGroup(mapData, ['E08000025'], mapJoinKey);
  render(
    <ThematicMap
      data={mockHealthData['Mock 318 for West Midlands CA']}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
      mapTitle="valid title"
    />
  );

  const title = screen.getByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('valid title');
});

it('should render the ThematicMap component', () => {
  const areaType = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  const mapGroup = getMapGroup(mapData, ['E08000025'], mapJoinKey);
  render(
    <ThematicMap
      data={mockHealthData['Mock 318 for West Midlands CA']}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
      mapTitle="valid title"
    />
  );

  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});
