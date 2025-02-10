'use client';

import { H3 } from 'govuk-react';
import Highcharts, { GeoJSON } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';

interface ThematicMapProps {
  data: HealthDataForArea[];
  mapData: GeoJSON;
  mapJoinKey: string;
  mapGroupBoundary: GeoJSON;
  mapTitle?: string;
}

// useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
// See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};
export function ThematicMap({
  data,
  mapData,
  mapJoinKey,
  mapGroupBoundary,
  mapTitle,
}: Readonly<ThematicMapProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const mapOptions: Highcharts.Options = {
    chart: {
      height: 800,
      animation: false,
      borderWidth: 0.2,
      borderColor: 'black',
    },
    title: { text: undefined },
    caption: { text: 'map source: data source:' },
    accessibility: { enabled: false },
    credits: { enabled: false },
    mapView: {
      projection: { name: 'Miller' },
      fitToGeometry: mapGroupBoundary.features[0].geometry,
      padding: 20,
    },
    mapNavigation: { enabled: true },
    colorAxis: { min: 0 },
    series: [
      {
        type: 'map',
        name: 'basemap',
        showInLegend: true,
        mapData: mapData,
        data: data.map((areaData) => {
          return {
            areaName: areaData.areaName,
            areaCode: areaData.areaCode,
            value: areaData.healthData[0].value,
          };
        }),
        joinBy: [mapJoinKey, 'areaCode'],
        borderColor: 'black',
        borderWidth: 0.2,
        states: { hover: { borderWidth: 1 } },
        tooltip: {
          headerFormat:
            '<span style="font-size: large; font-weight: bold">{point.areaName}</span><br />',
          pointFormat:
            '<span style="font-size: large">Value: {point.value} units</span>',
          footerFormat: '',
        },
      },
      {
        type: 'map',
        name: 'group border',
        zIndex: 3,
        showInLegend: true,
        mapData: mapGroupBoundary,
        data: [],
        borderColor: 'black',
        borderWidth: 3,
        nullColor: 'transparent',
      },
    ],
  };
  useEffect(() => {
    loadHighchartsModules(async () => {
      setOptions(mapOptions);
    });
  });

  if (!options) {
    return null;
  }

  return (
    <div data-testid="thematicMap-component">
      <H3>{mapTitle}</H3>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={options}
      />
    </div>
  );
}
