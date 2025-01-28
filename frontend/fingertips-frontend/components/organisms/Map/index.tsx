'use client';

import { H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import EnglandRegionsMap from '@/assets/Regions_December_2021_EN_BGC_2022_-4522802171286724651.geo.json';

interface FingertipsMapProps {}

export function FingertipsMap({}: Readonly<FingertipsMapProps>) {
  const fingertipsMapOptions: Highcharts.Options = {
    chart: {
      map: 'mapDataGB',
      height: 600,
      width: 600,
    },
    title: { text: 'Map Demo' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Regions',
        mapData: EnglandRegionsMap,
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
