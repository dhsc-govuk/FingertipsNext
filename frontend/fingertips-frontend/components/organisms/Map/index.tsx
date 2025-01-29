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
  const mockRegionData = [
    { RGN23NM: 'North East', RGN23CD: 'E12000001', value: 1 },
    { RGN23NM: 'North West', RGN23CD: 'E12000002', value: 1 },
    { RGN23NM: 'Yorkshire and The Humber', RGN23CD: 'E12000003', value: 2 },
    { RGN23NM: 'East Midlands', RGN23CD: 'E12000004', value: 3 },
    { RGN23NM: 'West Midlands', RGN23CD: 'E12000005', value: 5 },
    { RGN23NM: 'East of England', RGN23CD: 'E12000006', value: 8 },
    { RGN23NM: 'London', RGN23CD: 'E12000007', value: 13 },
    { RGN23NM: 'South East', RGN23CD: 'E12000008', value: 21 },
    { RGN23NM: 'South West', RGN23CD: 'E12000009', value: 34 },
  ];

  const RegionsMapOptions: Highcharts.Options = {
    chart: {
      map: RegionsMap,
      height: 800,
    },
    title: { text: 'England Regions - 2023' },
    mapView: {
      projection: {
        name: 'Miller', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
      },
    },
    credits: {
      enabled: false,
    },
    mapNavigation: { enabled: true },
    colorAxis: { min: 0 },
    series: [
      {
        name: 'Regions',
        showInLegend: false,
        mapData: RegionsMap,
        data: mockRegionData,
        joinBy: ['RGN23CD'],
        borderColor: 'black',
        borderWidth: 0.2,
        states: { hover: { borderWidth: 1 } },
        tooltip: {
          headerFormat:
            '<span style="font-size: large; font-weight: bold">{point.RGN23NM}</span><br />',
          pointFormat:
            '<span style="font-size: large">Value: {point.value} units</span>',
          footerFormat: '',
        },
      },
    ],
  };
  const CountiesAndUAsMapOptions: Highcharts.Options = {
    chart: {
      height: 800,
    },
    mapView: {
      projection: {
        name: 'Miller', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
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
        name: 'Miller', //Built-in projections are `EqualEarth`, `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
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
