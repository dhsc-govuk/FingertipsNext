'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import {
  determineAreaCodes,
  seriesDataWithoutEnglandOrGroup,
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
import {
  generateStandardLineChartOptions,
  LineChartVariant,
} from '@/components/organisms/LineChart/lineChartHelpers';
import { getAllDataWithoutInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { FormatValueAsNumber } from '@/lib/chartHelpers/labelFormatters';

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

  const englandBenchmarkData = healthIndicatorData.find(
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
    englandBenchmarkWithoutInequalities,
    groupDataWithoutInequalities,
  } = getAllDataWithoutInequalities(
    dataWithoutEnglandOrGroup,
    { englandBenchmarkData, groupData },
    areaCodes
  );

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    areaDataWithoutInequalities,
    true,
    {
      benchmarkData: englandBenchmarkWithoutInequalities,
      benchmarkComparisonMethod: benchmarkComparisonMethod,
      groupIndicatorData: groupDataWithoutInequalities,
      yAxisTitle,
      yAxisLabelFormatter: FormatValueAsNumber,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetadata?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );

  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      {shouldLineChartBeShown(
        areaDataWithoutInequalities,
        englandBenchmarkWithoutInequalities
      ) && (
        <>
          <H3>Indicator data over time</H3>
          <TabContainer
            id="lineChartAndTable"
            items={[
              {
                id: 'lineChart',
                title: 'Line chart',
                content: (
                  <LineChart
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
                    healthIndicatorData={areaDataWithoutInequalities}
                    englandBenchmarkData={englandBenchmarkWithoutInequalities}
                    groupIndicatorData={groupDataWithoutInequalities}
                    measurementUnit={indicatorMetadata?.unitLabel}
                    benchmarkComparisonMethod={benchmarkComparisonMethod}
                    polarity={polarity}
                  />
                ),
              },
            ]}
            footer={<DataSource dataSource={indicatorMetadata?.dataSource} />}
          />
        </>
      )}
      <Inequalities
        healthIndicatorData={healthIndicatorData}
        searchState={searchState}
        measurementUnit={indicatorMetadata?.unitLabel}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        dataSource={indicatorMetadata?.dataSource}
      />
    </section>
  );
}
