'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
  MapGeographyData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { BenchmarkLegend } from '../BenchmarkLegend';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client/models/IndicatorPolarity';
import { useSearchState } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  mapGeographyData: MapGeographyData;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit?: string;
  benchmarkIndicatorData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
}

const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};

export function ThematicMap({
  healthIndicatorData,
  mapGeographyData,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkIndicatorData,
  groupIndicatorData,
}: Readonly<ThematicMapProps>) {
  const { getSearchState } = useSearchState();
  const { [SearchParams.AreaTypeSelected]: areaType } = getSearchState();

  const [options, setOptions] = useState<Highcharts.Options>();
  // useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
  // See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
  //
  // as such, we're (mis)using useEffect to load the map on initial render, and not for interactivity.
  // the lint directive doesn't really apply here, and having either no dependency array, or mapOptions as a dependency
  // causes it to loop infinitely. (https://react.dev/reference/react/useEffect#examples-dependencies)
  useEffect(() => {
    void loadHighchartsModules(async () => {
      if (areaType) {
        setOptions(
          createThematicMapChartOptions(
            healthIndicatorData,
            mapGeographyData,
            areaType as AreaTypeKeysForMapMeta,
            benchmarkComparisonMethod,
            polarity,
            measurementUnit,
            benchmarkIndicatorData,
            groupIndicatorData
          )
        );
      }
    });
  }, [
    healthIndicatorData,
    mapGeographyData,
    areaType,
    benchmarkComparisonMethod,
    polarity,
    measurementUnit,
    benchmarkIndicatorData,
    groupIndicatorData,
  ]);

  // This prevents errors from trying to render before the module is loaded in the useEffect callback
  if (!options) {
    return null;
  }

  return (
    <div data-testid="thematicMap-component">
      <BenchmarkLegend
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
      />
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
