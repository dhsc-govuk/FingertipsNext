'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import {
  getMostRecentData,
  sortHealthDataByYearDescending,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
}

interface BarChartEmbeddedTableProps {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
}

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
  groupIndicatorData,
  measurementUnit,
}: Readonly<BarChartEmbeddedTableProps>) {
  const mostRecentYearData =
    sortHealthDataByYearDescending(healthIndicatorData);

  const tableRows = mostRecentYearData.map((item) => ({
    area: item.areaName,
    count: item.healthData[0].count,
    value: item.healthData[0].value,
    lowerCi: item.healthData[0].lowerCi,
    upperCi: item.healthData[0].upperCi,
  }));

  const sortedTableRows = tableRows.toSorted((a, b) => {
    if (!a.value && !b.value) return 0;
    if (!a.value) return 1;
    if (!b.value) return -1;
    return b.value - a.value;
  });

  const sortedHealthDataForBenchmark = sortHealthDataPointsByDescendingYear(
    benchmarkData?.healthData
  );

  const mostRecentBenchmarkData = getMostRecentData(
    sortedHealthDataForBenchmark
  );

  const sortedGroupHealthData = sortHealthDataPointsByDescendingYear(
    groupIndicatorData?.healthData
  );

  const mostRecentGroupData = getMostRecentData(sortedGroupHealthData);

  return (
    <div data-testid={'barChartEmbeddedTable-component'}>
      <Table
        head={
          <Table.Row>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.AreaName}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Count}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Value} {measurementUnit}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Lower}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Upper}
            </Table.CellHeader>
          </Table.Row>
        }
      >
        {mostRecentBenchmarkData ? (
          <Table.Row
            key={`${benchmarkData?.areaName}`}
            style={{ backgroundColor: GovukColours.MidGrey }}
            data-testid="table-row-benchmark"
          >
            <CheckValueInTableCell value={benchmarkData?.areaName} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.count} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.value} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.lowerCi} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.upperCi} />
          </Table.Row>
        ) : null}

        {mostRecentGroupData ? (
          <Table.Row
            key={`${groupIndicatorData?.areaName}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-group"
          >
            <CheckValueInTableCell value={groupIndicatorData?.areaName} />
            <CheckValueInTableCell value={mostRecentGroupData.count} />
            <CheckValueInTableCell value={mostRecentGroupData.value} />
            <CheckValueInTableCell value={mostRecentGroupData.lowerCi} />
            <CheckValueInTableCell value={mostRecentGroupData.upperCi} />
          </Table.Row>
        ) : null}

        {sortedTableRows.map((item) => (
          <Table.Row key={`${item.area}`}>
            <CheckValueInTableCell value={item.area} />
            <CheckValueInTableCell value={item.count} />
            <CheckValueInTableCell value={item.value} />
            <CheckValueInTableCell value={item.lowerCi} />
            <CheckValueInTableCell value={item.upperCi} />
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
