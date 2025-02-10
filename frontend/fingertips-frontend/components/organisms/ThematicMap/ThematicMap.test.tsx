import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { getMapJoinKey } from '@/lib/mapUtils/getMapJoinKey';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { getMapGroup } from '@/lib/mapUtils/getMapGroup';
import { ThematicMap } from '.';

const mockAreaType = 'Regions Statistical';
const mockMapData = getMapFile(mockAreaType);
const mockMapJoinKey = getMapJoinKey(mockAreaType);
const mockMapGroup = getMapGroup(mockMapData, ['E08000025'], mockMapJoinKey);

it('should render the ThematicMap title', async () => {
  render(
    <ThematicMap
      data={mockHealthData['318']}
      mapData={mockMapData}
      mapJoinKey={mockMapJoinKey}
      mapGroup={mockMapGroup}
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
      mapGroup={mockMapGroup}
      mapTitle="valid title"
    />
  );

  const highcharts = await screen.findByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});
