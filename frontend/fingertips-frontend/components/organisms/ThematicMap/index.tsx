'use client';

import { H2 } from 'govuk-react';
import Highcharts, { GeoJSON, GeoJSONFeature } from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface ThematicMapProps {
  data: HealthDataForArea[];
  mapData: GeoJSON;
  mapJoinKey: string;
  mapZoom: GeoJSONFeature;
}

export function ThematicMap({
  data,
  mapData,
  mapJoinKey,
  mapZoom,
}: Readonly<ThematicMapProps>) {
  const mapOptions: Highcharts.Options = {
    chart: {
      height: 800,
      animation: false,
    },
    accessibility: { enabled: false },
    title: { text: undefined },
    mapView: {
      projection: {
        name: 'Miller',
      },
      fitToGeometry: mapZoom,
      padding: 20,
    },
    credits: {
      enabled: false,
    },
    mapNavigation: { enabled: true },
    colorAxis: { min: 0 },
    series: [
      {
        type: 'map',
        name: 'Regions',
        showInLegend: false,
        mapData: mapData,
        joinBy: [mapJoinKey, 'areaCode'],
        // TODO: move this logic to page with a util
        data: data.map((areaData) => {
          return {
            areaName: areaData.areaName,
            areaCode: areaData.areaCode,
            value: areaData.healthData[0].value,
          };
        }),

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
    ],
  };

  return (
    <div>
      <H2>Fingertips Maps</H2>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={mapOptions}
      />
      <br />
    </div>
  );
}
