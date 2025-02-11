'use client';

import { H3 } from 'govuk-react';
import Highcharts, { GeoJSON } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';
import { MapData } from '@/lib/thematicMapUtils/getMapData';

interface ThematicMapProps {
  data: HealthDataForArea[];
  mapData: MapData;
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
      fitToGeometry: mapData.mapGroupBoundary.features[0].geometry,
      padding: 20,
    },
    mapNavigation: { enabled: true },
    colorAxis: { min: 0 },
    series: [
      {
        type: 'map',
        name: 'basemap',
        showInLegend: false,
        mapData: mapData.mapFile,
        borderColor: 'black',
        borderWidth: 0.2,
      },
      {
        type: 'map',
        name: 'group border',
        showInLegend: false,
        mapData: mapData.mapGroupBoundary,
        borderColor: 'black',
        borderWidth: 6,
      },
      {
        type: 'map',
        name: 'data',
        showInLegend: false,
        mapData: mapData.mapFile,
        data: data.map((areaData) => {
          return {
            areaName: areaData.areaName,
            areaCode: areaData.areaCode,
            value: areaData.healthData[0].value,
          };
        }),
        joinBy: [mapData.mapJoinKey, 'areaCode'],
        borderColor: 'black',
        allAreas: false,
        borderWidth: 0.5,
        states: {
          hover: {
            borderWidth: 2,
            borderColor: 'black',
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size: large; font-weight: bold">{point.areaName}</span><br />',
          pointFormat:
            '<span style="font-size: large">Value: {point.value} units</span>',
          footerFormat: '',
        },
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
