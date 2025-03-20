'use client';

import { H3 } from 'govuk-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';
import {
  benchmarkColourScale,
  MapData,
  prepareThematicMapSeriesData,
} from '@/lib/chartHelpers/thematicMapHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  mapData: MapData;
}

const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};
export function ThematicMap({
  healthIndicatorData,
  mapData,
}: Readonly<ThematicMapProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const data = prepareThematicMapSeriesData(healthIndicatorData);
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
    legend: {
      enabled: true,
      verticalAlign: 'top',
    },
    mapView: {
      projection: { name: 'Miller' },
      fitToGeometry: mapData.mapGroupBoundary.features[0].geometry,
      padding: 20,
    },
    mapNavigation: { enabled: true },
    colorAxis: {
      dataClasses: benchmarkColourScale,
    },
    series: [
      {
        type: 'map',
        name: 'basemap',
        showInLegend: false,
        mapData: mapData.mapFile,
        borderColor: GovukColours.Black,
        borderWidth: 0.2,
      },
      {
        type: 'map',
        name: 'group border',
        showInLegend: false,
        mapData: mapData.mapGroupBoundary,
        borderColor: GovukColours.Black,
        borderWidth: 6,
      },
      {
        type: 'map',
        colorKey: 'benchmarkColourCode',
        name: 'data',
        mapData: mapData.mapFile,
        data: data,
        joinBy: [mapData.mapJoinKey, 'areaCode'],
        borderColor: GovukColours.Black,
        allAreas: false,
        borderWidth: 0.5,
        states: {
          hover: {
            borderWidth: 2,
            borderColor: GovukColours.Black,
          },
        },
        dataLabels: { format: 'T' },
        tooltip: {
          headerFormat:
            '<span style="font-size: large; font-weight: bold">{point.areaName}</span><br />',
          pointFormat:
            '<span style="font-size: large">Value: {point.value} units</span>' +
            '<br /><span>benchmark: {point.benchmarkComparison}</span>' +
            '<br /><span>benchmark colourCode: {point.benchmarkColourCode}</span>',
          // footerFormat: '<br />',
        },
      },
    ],
  };
  // useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
  // See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
  //
  // as such, we're (mis)using useEffect to load the map on initial render, and not for interactivity.
  // the lint directive doesn't really apply here, and having either no dependency array, or mapOptions as a dependency
  // causes it to loop infinitely. (https://react.dev/reference/react/useEffect#examples-dependencies)
  useEffect(() => {
    loadHighchartsModules(async () => {
      setOptions(mapOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!options) {
    return null;
  }

  return (
    <div data-testid="thematicMap-component">
      <H3>Compare an indicator by areas</H3>
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
