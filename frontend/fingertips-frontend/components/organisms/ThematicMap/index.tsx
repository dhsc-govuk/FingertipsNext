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
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ThematicMapCredits } from '../../molecules/ThematicMapCredits';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  mapGeographyData: MapGeographyData;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkIndicatorData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
}

const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};

export function ThematicMap({
  healthIndicatorData,
  mapGeographyData,
  benchmarkComparisonMethod,
  polarity,
  benchmarkIndicatorData,
  groupIndicatorData,
  indicatorMetadata,
}: Readonly<ThematicMapProps>) {
  const { getSearchState } = useSearchState();
  const { [SearchParams.AreaTypeSelected]: areaType } = getSearchState();

  const [options, setOptions] = useState<Highcharts.Options>();
  // useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
  // See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
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
            indicatorMetadata,
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
    indicatorMetadata,
    benchmarkIndicatorData,
    groupIndicatorData,
  ]);

  // This prevents errors from trying to render before the module is loaded in the useEffect callback
  if (!options) {
    return null;
  }

  return (
    <div
      data-testid="thematicMap-component"
      style={{
        border: `1px solid ${GovukColours.Black}`,
        paddingInline: '5px',
      }}
    >
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
      <ThematicMapCredits
        areaType={areaType as AreaTypeKeysForMapMeta}
        dataSource={indicatorMetadata?.dataSource}
      />
    </div>
  );
}
