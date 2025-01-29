'use client';

import { H2, H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import RegionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import CountiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import DistrictsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';

interface FingertipsMapProps {}

export function FingertipsMap({}: Readonly<FingertipsMapProps>) {
  const data = [
    ['E12000001', 1],
    ['E12000002', 1],
    ['E12000003', 2],
    ['E12000004', 3],
    ['E12000005', 5],
    ['E12000006', 8],
    ['E12000007', 13],
    ['E12000008', 21],
    ['E12000009', 34],
  ];

  const RegionsMapOptions: Highcharts.Options = {
    chart: {
      map: RegionsMap,
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
      },
    },
    title: { text: 'England Regions - 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        name: 'Basemap',
        mapData: RegionsMap,
        data: data,
        joinBy: ['RGN23CD', 'code'],
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
    title: { text: 'England Counties and UAs - 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        name: 'Basemap',
        mapData: CountiesAndUAsMap,
        borderColor: '#000000',
        showInLegend: false,
      },
    ],
  };

  const DistrictsAndUAsMapOptions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'EqualEarth', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
      },
    },
    title: { text: 'England Districts and UAs - 2024' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
        name: 'Basemap',
        mapData: DistrictsAndUAsMap,
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
    title: { text: 'England NHS Regions - 2024' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
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
    title: { text: 'England NHS ICBs - 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
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
    title: { text: 'England NHS Sub ICBs - 2023' },
    credits: { enabled: false },
    mapNavigation: { enabled: true },
    series: [
      {
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
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={DistrictsAndUAsMapOptions}
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
