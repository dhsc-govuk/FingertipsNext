'use client';

import { H2, H3 } from 'govuk-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface FingertipsMapProps {
  data: HealthDataForArea[];
  areaType: string;
}

export function FingertipsMap({
  data,
  areaType,
}: Readonly<FingertipsMapProps>) {
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

  switch (areaType) {
    case 'regions':
      mapOptions.series[0].mapData = regionsMap;
      mapOptions.series[0].joinBy = ['RGN23CD', 'areaCode'];
      break;

    case 'NHS regions':
      mapOptions.series[0].mapData = NHSRegionsMap;
      mapOptions.series[0].joinBy = ['NHSER24CD', 'areaCode'];
      break;
  }

  return (
    <div>
      <H2>Fingertips Maps</H2>
      <H3>Map of {areaType}</H3>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={mapOptions}
      />
      <br />
    </div>
  );
}
