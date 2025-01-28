'use client';

import { H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import EnglandRegionsMapBUC from '@/assets/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import EnglandNHSRegionsMapBSC from '@/assets/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';

interface FingertipsMapProps {}

export function FingertipsMap({}: Readonly<FingertipsMapProps>) {
  const fingertipsMapOptionsRegions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
      },
    },
    title: { text: 'England Regions BUC 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Regions',
        mapData: EnglandRegionsMapBUC,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  const fingertipsMapOptionsNHSRegions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth',
      },
    },
    title: { text: 'England NHS Regions BSC 2024' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Regions',
        mapData: EnglandNHSRegionsMapBSC,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  return (
    <div>
      <H3>Fingertips Map</H3>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={fingertipsMapOptionsRegions}
      />
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={fingertipsMapOptionsNHSRegions}
      />
      <br />
    </div>
  );
}
