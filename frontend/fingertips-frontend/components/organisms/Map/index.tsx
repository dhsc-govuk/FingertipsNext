'use client';

import { H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import mapDataGB from '@highcharts/map-collection/countries/gb/gb-all.geo.json';

interface FingertipsMapProps {}

export function FingertipsMap({}: Readonly<FingertipsMapProps>) {
  const fingertipsMapOptions: Highcharts.Options = {
    chart: {
      map: 'mapDataGB',
    },
    title: { text: 'Map Demo' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Basemap',
        mapData: mapDataGB,
        borderColor: '#A0A0A0',
        nullColor: 'rgba(200, 200, 200, 0.3)',
        showInLegend: false,
      },
    ],
  };
  return (
    <div>
      <H3>Map</H3>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={fingertipsMapOptions}
      />
    </div>
  );
}
