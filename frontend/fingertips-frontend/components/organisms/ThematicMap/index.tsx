'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useEffect, useState } from 'react';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { BenchmarkLegend } from '../BenchmarkLegend';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client/models/IndicatorPolarity';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ThematicMapCredits } from '../../molecules/ThematicMapCredits';
import { BenchmarkTooltip } from '@/components/molecules/BenchmarkTooltip';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { useMapGeographyData } from '@/components/organisms/ThematicMap/useMapGeographyData';
import { H3 } from 'govuk-react';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  selectedAreaType?: string;
  areaCodes: string[];
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
  selectedAreaType,
  areaCodes,
  benchmarkComparisonMethod,
  polarity,
  benchmarkIndicatorData,
  groupIndicatorData,
  indicatorMetadata,
}: Readonly<ThematicMapProps>) {
  const { isLoading, error, mapGeographyData } = useMapGeographyData(
    areaCodes,
    selectedAreaType as AreaTypeKeysForMapMeta
  );

  const [options, setOptions] = useState<Highcharts.Options>();
  // useEffect and async loading of map module to address issue with Highcharts 12 with Next 15.
  // See: https://github.com/highcharts/highcharts-react/issues/502#issuecomment-2531711517
  useEffect(() => {
    if (!mapGeographyData || !selectedAreaType) return;
    void loadHighchartsModules(async () => {
      setOptions(
        createThematicMapChartOptions(
          healthIndicatorData,
          mapGeographyData,
          selectedAreaType as AreaTypeKeysForMapMeta,
          benchmarkComparisonMethod,
          polarity
        )
      );
    });
  }, [
    healthIndicatorData,
    mapGeographyData,
    selectedAreaType,
    benchmarkComparisonMethod,
    polarity,
    indicatorMetadata,
    benchmarkIndicatorData,
    groupIndicatorData,
  ]);

  if (isLoading) {
    return <div style={{ marginBottom: '2rem' }}>Loading map geometry...</div>;
  }

  if (error) {
    console.warn('error loading/processing map geometry', error);
    return null;
  }

  // This prevents errors from trying to render before the module is loaded in the useEffect callback
  if (!options) {
    return null;
  }

  return (
    <>
      <H3>Compare an indicator by areas</H3>
      <div
        data-testid="thematicMap-component"
        style={{
          border: `1px solid ${GovukColours.LightGrey}`,
          paddingInline: '5px',
        }}
      >
        {healthIndicatorData.map((indicatorDataForArea) => {
          return (
            <div
              key={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              id={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              style={{ display: 'none' }}
            >
              <BenchmarkTooltip
                indicatorData={indicatorDataForArea}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                measurementUnit={indicatorMetadata?.unitLabel}
                indicatorDataForBenchmark={benchmarkIndicatorData}
                indicatorDataForGroup={groupIndicatorData}
                polarity={polarity}
              />
            </div>
          );
        })}
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
          areaType={selectedAreaType as AreaTypeKeysForMapMeta}
          dataSource={indicatorMetadata?.dataSource}
        />
      </div>
    </>
  );
}
