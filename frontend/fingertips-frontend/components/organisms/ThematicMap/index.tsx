'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';
import {
  createThematicMapChartOptions,
  MapData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { BenchmarkLegend } from '../BenchmarkLegend';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  mapData: MapData;
  indicatorDataSource?: string;
}

const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};
export function ThematicMap({
  healthIndicatorData,
  mapData,
  // indicatorDataSource,
}: Readonly<ThematicMapProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  // TODO: validate approach to caption
  // let captionText = `<span>Map Source: ${mapData.mapSource}</span>`;
  // if (indicatorDataSource)
  //   captionText += `<span> <br /><br />Data Source: ${indicatorDataSource}</span>`;

  // useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
  // See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
  //
  // as such, we're (mis)using useEffect to load the map on initial render, and not for interactivity.
  // the lint directive doesn't really apply here, and having either no dependency array, or mapOptions as a dependency
  // causes it to loop infinitely. (https://react.dev/reference/react/useEffect#examples-dependencies)
  useEffect(() => {
    loadHighchartsModules(async () => {
      setOptions(createThematicMapChartOptions(mapData, healthIndicatorData));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid="thematicMap-component">
      {/* TODO: update to match benchmark type */}
      <BenchmarkLegend rag={true} quintiles={true} />
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-thematicMap-component',
        }}
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={options}
      />
    </div>
  );
}
