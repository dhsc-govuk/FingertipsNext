import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { InequalitiesBarChart } from '@/components/molecules/Inequalities/BarChart';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React from 'react';
import {
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesLineChartTableData,
  mapToInequalitiesTableData,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
}

export function Inequalities({
  healthIndicatorData,
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
  const barchartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: lineChartTableData.rowData[latestDataIndex],
  };

  // TODO: Only a single type of inequality is shown at once. Hence, make the type deductions on this parent component and pass down all the required data to the children.
  // Pass down benchmark data to each component - Persons if the type is Sex and England if the type is Deprivation

  return (
    <div data-testid="inequalities-component">
      <H4>Inequalities data in a single time period</H4>
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: (
              <InequalitiesBarChart
                barChartData={barchartData}
                yearlyHealthDataGroupedByInequalities={
                  yearlyHealthDataGroupedByInequalities
                }
              />
            ),
          },
          {
            id: 'inequalitiesBarChartTable',
            title: 'Table',
            content: (
              <InequalitiesBarChartTable
                tableData={barchartData}
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
