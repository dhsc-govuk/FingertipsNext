'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import {
  getMostRecentDataFromSorted,
  sortHealthDataByYearDescending,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';
import React from 'react';
import { SparklineChart } from '@/components/organisms/SparklineChart';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  Period = 'Period',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
  ConfidenceLimit = '95% confidence limits',
}

interface BarChartEmbeddedTableProps {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
}

const formatHeader = (title: BarChartEmbeddedTableHeadingEnum) => {
  return title.split(' ').map((word, index) => (
    <React.Fragment key={`${word}-${index}`}>
      {word}
      <br />
    </React.Fragment>
  ));
};

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
  groupIndicatorData,
  measurementUnit,
}: Readonly<BarChartEmbeddedTableProps>) {
  const mostRecentYearData =
    sortHealthDataByYearDescending(healthIndicatorData);

  const extractValues = healthIndicatorData.flatMap((item) =>
    item.healthData
      .map((item) => item.value)
      .filter((value) => value !== undefined)
  );
  const maxValue = Math.max(...extractValues);

  const tableRows = mostRecentYearData.map((item) => ({
    area: item.areaName,
    period: item.healthData[0].year,
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

  const mostRecentBenchmarkData = getMostRecentDataFromSorted(
    sortedHealthDataForBenchmark
  );

  const sortedGroupHealthData = sortHealthDataPointsByDescendingYear(
    groupIndicatorData?.healthData
  );

  const mostRecentGroupData = getMostRecentDataFromSorted(
    sortedGroupHealthData
  );

  return (
    <div data-testid={'barChartEmbeddedTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={5}></Table.CellHeader>
              <Table.CellHeader colSpan={2} style={{ textAlign: 'center' }}>
                {formatHeader(BarChartEmbeddedTableHeadingEnum.ConfidenceLimit)}
              </Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.AreaName}
              </Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ textAlign: 'right', paddingRight: '0px' }}
              >
                {BarChartEmbeddedTableHeadingEnum.Value} {measurementUnit}
              </Table.CellHeader>
              <Table.CellHeader></Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.Lower}
              </Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.Upper}
              </Table.CellHeader>
            </Table.Row>
          </React.Fragment>
        }
      >
        {mostRecentBenchmarkData ? (
          <Table.Row
            key={`${benchmarkData?.areaName}`}
            style={{ backgroundColor: GovukColours.MidGrey }}
            data-testid="table-row-benchmark"
          >
            <CheckValueInTableCell value={benchmarkData?.areaName} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.year} />
            <CheckValueInTableCell value={mostRecentBenchmarkData.count} />
            <CheckValueInTableCell
              value={mostRecentBenchmarkData.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={mostRecentBenchmarkData.value}
                maxValue={maxValue}
              ></SparklineChart>
            </Table.Cell>
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
            <CheckValueInTableCell value={mostRecentGroupData.year} />
            <CheckValueInTableCell value={mostRecentGroupData.count} />
            <CheckValueInTableCell
              value={mostRecentGroupData.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={mostRecentGroupData.value}
                maxValue={maxValue}
              />
            </Table.Cell>
            <CheckValueInTableCell value={mostRecentGroupData.lowerCi} />
            <CheckValueInTableCell value={mostRecentGroupData.upperCi} />
          </Table.Row>
        ) : null}

        {sortedTableRows.map((item) => (
          <Table.Row key={`${item.area}`}>
            <CheckValueInTableCell value={item.area} />
            <CheckValueInTableCell value={item.period} />
            <CheckValueInTableCell value={item.count} />
            <CheckValueInTableCell
              value={item.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart value={item.value} maxValue={maxValue} />
            </Table.Cell>
            <CheckValueInTableCell value={item.lowerCi} />
            <CheckValueInTableCell value={item.upperCi} />
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
