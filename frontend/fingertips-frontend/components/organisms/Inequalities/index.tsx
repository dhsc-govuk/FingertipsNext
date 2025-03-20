import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { InequalitiesBarChart } from '@/components/molecules/Inequalities/BarChart';
import { InequalitiesLineChart } from '@/components/molecules/Inequalities/LineChart';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React from 'react';
import {
  getBenchmarkData,
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesChartData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  type?: InequalitiesTypes;
  measurementUnit?: string;
}

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
  searchState,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const { [SearchParams.AreasSelected]: areasSelected } = searchState;

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

  const barChartBenchmarkValue = getBenchmarkData(type, barchartData);

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
                dynamicKeys={dynamicKeys}
                benchmarkValue={barChartBenchmarkValue}
                measurementUnit={measurementUnit}
                areasSelected={areasSelected}
                yAxisLabel="Value"
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
              <InequalitiesLineChart
                lineChartData={lineChartData}
                areasSelected={areasSelected}
                dynamicKeys={dynamicKeys}
                measurementUnit={measurementUnit}
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
