import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesTable } from '@/components/molecules/Inequalities/LineChart/Table';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import React from 'react';
import {
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  mapToKey,
} from './inequalitiesHelpers';
import { H4 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
}

export interface InequalitiesLineChartTableData {
  areaName: string;
  rowData: InequalitiesTableRowData[];
}

export interface InequalitiesBarChartTableData {
  areaName: string;
  data: InequalitiesTableRowData;
}

export interface RowDataFields {
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
}

export interface InequalitiesTableRowData {
  [key: string]: number | RowDataFields | undefined;
}

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >
): InequalitiesTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((key) => {
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[key]
    ).reduce(
      (acc: Record<string, RowDataFields | undefined>, current: string) => {
        const currentTableKey = yearDataGroupedByInequalities[key][current];
        acc[mapToKey(current)] = currentTableKey?.at(0)
          ? {
              count: currentTableKey[0].count,
              value: currentTableKey[0].value,
              lower: currentTableKey[0].lowerCi,
              upper: currentTableKey[0].upperCi,
            }
          : undefined;
        return acc;
      },
      {}
    );

    return { period: Number(key), ...dynamicFields };
  });
};

export function Inequalities({
  healthIndicatorData,
}: Readonly<InequalitiesProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(yearlyHealthdata);

  const tableData: InequalitiesLineChartTableData = {
    areaName: healthIndicatorData.areaName,
    rowData: mapToInequalitiesTableData(yearlyHealthDataGroupedByInequalities),
  };

  const latestDataIndex = tableData.rowData.length - 1;
  const barchartTableData: InequalitiesBarChartTableData = {
    areaName: healthIndicatorData.areaName,
    data: tableData.rowData[latestDataIndex],
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
            title: 'Tabular data',
            content: (
              <InequalitiesBarChartTable
                tableData={barchartTableData}
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
            title: 'Tabular data',
            content: (
              <InequalitiesTable
                tableData={tableData}
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
