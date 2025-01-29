'use client';

import { H2, H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import RegionsMap from '@/assets/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import CountiesAndUAsMap from '@/assets/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import NHSRegionsMap from '@/assets/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';

interface FingertipsMapProps {}

export function FingertipsMap({}: Readonly<FingertipsMapProps>) {
  const RegionsMapOptions: Highcharts.Options = {
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
        name: 'Basemap',
        mapData: RegionsMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };
  const CountiesAndUAsMapOptions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
      },
    },
    title: { text: 'England Counties an UAs - 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Basemap',
        mapData: CountiesAndUAsMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  const NHSRegionsMapOptions: Highcharts.Options = {
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
        name: 'Basemap',
        mapData: NHSRegionsMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  const NHSICBMapOptions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth',
      },
    },
    title: { text: 'England NHS ICBs BSC 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Basemap',
        mapData: NHSICBMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  const NHSSubICBMapOptions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth',
      },
    },
    title: { text: 'England NHS Sub ICBs BSC 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        // use be map with no data as a basemap
        name: 'Basemap',
        mapData: NHSSubICBMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  return (
    <div>
      <H3>Fingertips Maps</H3>
      <H2>Administrative Areas</H2>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={RegionsMapOptions}
      />
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={CountiesAndUAsMapOptions}
      />
      <H2>NHS Areas</H2>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={NHSRegionsMapOptions}
      />
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={NHSICBMapOptions}
      />
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={NHSSubICBMapOptions}
      />
      <br />
    </div>
  );
}
