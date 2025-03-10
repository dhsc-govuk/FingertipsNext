'use client';

import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React from 'react';
import {
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartTableData,
  InequalitiesLineChartTableData,
  mapToInequalitiesTableData,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  measurementUnit?: string;
}

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
}: Readonly<InequalitiesProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(yearlyHealthdata);

  const lineChartTableData: InequalitiesLineChartTableData = {
    areaName: healthIndicatorData.areaName,
    rowData: mapToInequalitiesTableData(yearlyHealthDataGroupedByInequalities),
  };

  const latestDataIndex = lineChartTableData.rowData.length - 1;
  const barchartTableData: InequalitiesBarChartTableData = {
    areaName: healthIndicatorData.areaName,
    data: lineChartTableData.rowData[latestDataIndex],
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
                measurementUnit={measurementUnit}
                yearlyHealthDataGroupedByInequalities={
                  yearlyHealthDataGroupedByInequalities
                }
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
            content: <div>To be created</div>,
          },
          {
            id: 'inequalitiesLineChartTable',
            title: 'Table',
            content: (
              <InequalitiesLineChartTable
                tableData={lineChartTableData}
                yearlyHealthDataGroupedByInequalities={
                  yearlyHealthDataGroupedByInequalities
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}
