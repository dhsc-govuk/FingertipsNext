import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { InequalitiesLineChart } from '@/components/molecules/Inequalities/LineChart';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React from 'react';
import {
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesTypes,
  InequalitiesBarChartTableData,
  InequalitiesChartData,
  mapToInequalitiesTableData,
  getDynamicKeys,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  type?: InequalitiesTypes;
}

export function Inequalities({
  healthIndicatorData,
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
  const barchartTableData: InequalitiesBarChartTableData = {
    areaName: healthIndicatorData.areaName,
    data: lineChartData.rowData[latestDataIndex],
  };

  return (
    <div data-testid="inequalities-component">
      <H4>Inequalities data in a single time period</H4>
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: <div>To be created</div>,
          },
          {
            id: 'inequalitiesBarChartTable',
            title: 'Table',
            content: (
              <InequalitiesBarChartTable
                tableData={barchartTableData}
                dynamicKeys={dynamicKeys}
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
              />
            ),
          },
          {
            id: 'inequalitiesLineChartTable',
            title: 'Table',
            content: (
              <InequalitiesLineChartTable
                tableData={lineChartData}
                dynamicKeys={dynamicKeys}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
