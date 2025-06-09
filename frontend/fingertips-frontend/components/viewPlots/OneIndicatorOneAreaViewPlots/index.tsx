'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import {
  determineAreaCodes,
  seriesDataWithoutEnglandOrGroup,
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { H3 } from 'govuk-react';
import { OneIndicatorViewPlotProps } from '../ViewPlot.types';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { Inequalities } from '@/components/organisms/Inequalities';
import { getAllDataWithoutInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import {
  generateStandardLineChartOptions,
  LineChartVariant,
} from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import Highcharts from 'highcharts';

function shouldLineChartBeShown(
  dataWithoutEnglandOrGroup: HealthDataForArea[],
  englandBenchmarkData: HealthDataForArea | undefined
) {
  return (
    dataWithoutEnglandOrGroup[0]?.healthData.length > 1 ||
    (englandBenchmarkData && englandBenchmarkData.healthData.length > 1)
  );
}

export function OneIndicatorOneAreaViewPlots({
  indicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<OneIndicatorViewPlotProps>) {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(areasSelected);

  const polarity = indicatorData.polarity as IndicatorPolarity;
  const benchmarkComparisonMethod =
    indicatorData.benchmarkMethod as BenchmarkComparisonMethod;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];
  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );

  const englandIndicatorData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode !== areaCodeForEngland
      ? healthIndicatorData.find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;

  const {
    areaDataWithoutInequalities,
    englandDataWithoutInequalities,
    groupDataWithoutInequalities,
  } = getAllDataWithoutInequalities(
    dataWithoutEnglandOrGroup,
    { englandIndicatorData, groupData },
    areaCodes
  );

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    areaDataWithoutInequalities,
    true,
    benchmarkToUse,
    {
      indicatorName: indicatorData.name,
      englandData: englandDataWithoutInequalities,
      benchmarkComparisonMethod: benchmarkComparisonMethod,
      groupIndicatorData: groupDataWithoutInequalities,
      yAxisTitle,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetadata?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );

  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <BenchmarkSelectArea
        availableAreas={availableAreasForBenchmarking}
        benchmarkAreaSelectedKey={SearchParams.BenchmarkAreaSelected}
        searchState={searchState}
      />
      {shouldLineChartBeShown(
        areaDataWithoutInequalities,
        englandDataWithoutInequalities
      ) && (
        <StyleChartWrapper>
          <H3>Indicator data over time</H3>
          <TabContainer
            id="lineChartAndTable"
            items={[
              {
                id: 'lineChart',
                title: 'Line chart',
                content: (
                  <LineChart
                    title={lineChartOptions.title?.text ?? ''}
                    lineChartOptions={lineChartOptions}
                    variant={LineChartVariant.Standard}
                  />
                ),
              },
              {
                id: 'lineChartTable',
                title: 'Table',
                content: (
                  <LineChartTable
                    title={lineChartOptions.title?.text ?? ''}
                    healthIndicatorData={areaDataWithoutInequalities}
                    englandIndicatorData={englandDataWithoutInequalities}
                    groupIndicatorData={groupDataWithoutInequalities}
                    indicatorMetadata={indicatorMetadata}
                    benchmarkComparisonMethod={benchmarkComparisonMethod}
                    polarity={polarity}
                    benchmarkToUse={benchmarkToUse}
                  />
                ),
              },
            ]}
            footer={<DataSource dataSource={indicatorMetadata?.dataSource} />}
          />
        </StyleChartWrapper>
      )}
      <Inequalities
        healthIndicatorData={healthIndicatorData}
        searchState={searchState}
        indicatorMetadata={indicatorMetadata}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        dataSource={indicatorMetadata?.dataSource}
      />
    </section>
  );
}
