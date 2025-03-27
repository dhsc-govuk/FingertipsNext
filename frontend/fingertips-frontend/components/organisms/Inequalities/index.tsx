import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { InequalitiesBarChart } from '@/components/molecules/Inequalities/BarChart';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import React, { useState } from 'react';
import {
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesChartData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
  generateInequalitiesLineChartOptions,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { LineChart } from '../LineChart';
import { LineChartVariant } from '../LineChart/lineChartHelpers';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  type?: InequalitiesTypes;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

const generateInequalitiesLineChartTooltipStringList = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
  <span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.series.name}</br>Value: ${point.y}`,
];

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
  searchState,
  type = InequalitiesTypes.Sex,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}: Readonly<InequalitiesProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const { [SearchParams.AreasSelected]: areasSelected } = searchState;

  const [
    showInequalitiesLineChartConfidenceIntervals,
    setShowInequalitiesLineChartConfidenceIntervals,
  ] = useState<boolean>(false);

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(yearlyHealthdata);

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );

  const lineChartData: InequalitiesChartData = {
    areaName: healthIndicatorData.areaName,
    rowData: mapToInequalitiesTableData(yearlyHealthDataGroupedByInequalities),
  };

  const latestDataIndex = lineChartData.rowData.length - 1;
  const barchartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: lineChartData.rowData[latestDataIndex],
  };

  const inequalitiesLineChartOptions: Highcharts.Options =
    generateInequalitiesLineChartOptions(
      lineChartData,
      dynamicKeys,
      type,
      showInequalitiesLineChartConfidenceIntervals,
      generateInequalitiesLineChartTooltipStringList,
      {
        areasSelected,
        yAxisTitleText: 'Value',
        xAxisTitleText: 'Year',
        measurementUnit,
      }
    );

  return (
    <div data-testid="inequalities-component">
      <H4>Inequalities data for a single time period</H4>
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: (
              <InequalitiesBarChart
                barChartData={barchartData}
                measurementUnit={measurementUnit}
                yAxisLabel="Value"
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
              />
            ),
          },
          {
            id: 'inequalitiesBarChartTable',
            title: 'Table',
            content: (
              <InequalitiesBarChartTable
                tableData={barchartData}
                measurementUnit={measurementUnit}
                type={type}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
              />
            ),
          },
        ]}
      />
      <br />
      <H4>Inequalities data over time</H4>
      <TabContainer
        id="inequalitiesLineChartAndTable"
        items={[
          {
            id: 'inequalitiesLineChart',
            title: 'Line chart',
            content: (
              <LineChart
                lineChartOptions={inequalitiesLineChartOptions}
                showConfidenceIntervalsData={
                  showInequalitiesLineChartConfidenceIntervals
                }
                setShowConfidenceIntervalsData={
                  setShowInequalitiesLineChartConfidenceIntervals
                }
                variant={LineChartVariant.Inequalities}
              />
            ),
          },
          {
            id: 'inequalitiesLineChartTable',
            title: 'Table',
            content: (
              <InequalitiesLineChartTable
                tableData={lineChartData}
                measurementUnit={measurementUnit}
                dynamicKeys={dynamicKeys}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
