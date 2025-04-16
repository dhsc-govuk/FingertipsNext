'use client';

import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import {
  AreaTypeLabelEnum,
  getConfidenceLimitNumber,
  getMostRecentData,
  sortHealthDataByYearDescending,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  CheckValueInTableCell,
  FormatNumberInTableCell,
} from '@/components/molecules/CheckValueInTableCell';
import React, { useState } from 'react';
import { SparklineChart } from '@/components/organisms/SparklineChart';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { TrendTag } from '@/components/molecules/TrendTag';
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRows } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedRows';
import { DataSource } from '@/components/atoms/DataSource/DataSource';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  RecentTrend = 'Recent trend',
  Period = 'Period',
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
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  dataSource?: string;
}

const formatHeader = (title: string) => {
  return title.split(' ').map((word, index) => (
    <React.Fragment key={`${word}-${index}`}>
      {word}
      <br />
    </React.Fragment>
  ));
};

const chartName = 'barChartEmbeddedTable';

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
  groupIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  dataSource,
}: Readonly<BarChartEmbeddedTableProps>) {
  const mostRecentYearData =
    sortHealthDataByYearDescending(healthIndicatorData);

  const extractValues = healthIndicatorData.flatMap((item) =>
    item.healthData
      .map((item) => item.value)
      .filter((value) => value !== undefined)
  );
  const maxValue = Math.max(...extractValues);

  const tableRows: BarChartEmbeddedTableRow[] = mostRecentYearData.map(
    (item) => ({
      area: item.areaName,
      period: item.healthData[0].year,
      trend: item.healthData[0].trend,
      count: item.healthData[0].count,
      value: item.healthData[0].value,
      lowerCi: item.healthData[0].lowerCi,
      upperCi: item.healthData[0].upperCi,
      benchmarkComparison: item.healthData[0].benchmarkComparison,
    })
  );

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

  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState(false);

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);

  return (
    <div data-testid={'barChartEmbeddedTable-component'}>
      <ConfidenceIntervalCheckbox
        chartName={chartName}
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      />
      <BenchmarkLegend
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
      />

      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={6}></Table.CellHeader>
              <Table.CellHeader colSpan={2} style={{ textAlign: 'center' }}>
                {confidenceLimit
                  ? formatHeader(`${confidenceLimit}% confidence limits`)
                  : null}
              </Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BarChartEmbeddedTableHeadingEnum.AreaName}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BarChartEmbeddedTableHeadingEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'center' }}
              >
                {BarChartEmbeddedTableHeadingEnum.RecentTrend}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {BarChartEmbeddedTableHeadingEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader
                colSpan={2}
                style={{ verticalAlign: 'top', textAlign: 'center' }}
              >
                {BarChartEmbeddedTableHeadingEnum.Value} {measurementUnit}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BarChartEmbeddedTableHeadingEnum.Lower}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BarChartEmbeddedTableHeadingEnum.Upper}
              </Table.CellHeader>
            </Table.Row>
          </React.Fragment>
        }
      >
        {mostRecentBenchmarkData ? (
          <Table.Row
            key={`${benchmarkData?.areaName}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-benchmark"
          >
            <CheckValueInTableCell
              value={benchmarkData?.areaName}
              style={{ textAlign: 'left' }}
            />
            <CheckValueInTableCell
              value={mostRecentBenchmarkData.year}
              style={{ textAlign: 'right' }}
            />
            <Table.Cell style={{ textAlign: 'center' }}>
              <TrendTag trendFromResponse={mostRecentBenchmarkData.trend} />
            </Table.Cell>
            <FormatNumberInTableCell
              value={mostRecentBenchmarkData.count}
              numberStyle={'whole'}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={mostRecentBenchmarkData.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={[mostRecentBenchmarkData.value]}
                maxValue={maxValue}
                confidenceIntervalValues={[
                  mostRecentBenchmarkData.lowerCi,
                  mostRecentBenchmarkData.upperCi,
                ]}
                showConfidenceIntervalsData={showConfidenceIntervalsData}
                benchmarkOutcome={
                  mostRecentBenchmarkData.benchmarkComparison?.outcome
                }
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                label={AreaTypeLabelEnum.Benchmark}
                area={benchmarkData?.areaName}
                year={mostRecentBenchmarkData.year}
                measurementUnit={measurementUnit}
                barColor={GovukColours.DarkGrey}
              ></SparklineChart>
            </Table.Cell>
            <FormatNumberInTableCell
              value={mostRecentBenchmarkData.lowerCi}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={mostRecentBenchmarkData.upperCi}
              style={{ textAlign: 'right' }}
            />
          </Table.Row>
        ) : null}

        {mostRecentGroupData ? (
          <Table.Row
            key={`${groupIndicatorData?.areaName}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-group"
          >
            <CheckValueInTableCell
              value={groupIndicatorData?.areaName}
              style={{ textAlign: 'left' }}
            />
            <CheckValueInTableCell
              value={mostRecentGroupData.year}
              style={{ textAlign: 'right' }}
            />
            <Table.Cell style={{ textAlign: 'center' }}>
              <TrendTag trendFromResponse={mostRecentGroupData.trend} />
            </Table.Cell>
            <FormatNumberInTableCell
              value={mostRecentGroupData.count}
              numberStyle={'whole'}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={mostRecentGroupData.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={[mostRecentGroupData.value]}
                maxValue={maxValue}
                confidenceIntervalValues={[
                  mostRecentGroupData.lowerCi,
                  mostRecentGroupData.upperCi,
                ]}
                showConfidenceIntervalsData={showConfidenceIntervalsData}
                benchmarkOutcome={
                  mostRecentGroupData.benchmarkComparison?.outcome
                }
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                label={AreaTypeLabelEnum.Group}
                area={groupIndicatorData?.areaName}
                year={mostRecentGroupData.year}
                measurementUnit={measurementUnit}
                barColor={GovukColours.DarkGrey}
              />
            </Table.Cell>
            <FormatNumberInTableCell
              value={mostRecentGroupData.lowerCi}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={mostRecentGroupData.upperCi}
              style={{ textAlign: 'right' }}
            />
          </Table.Row>
        ) : null}

        <BarChartEmbeddedRows
          rows={sortedTableRows}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          maxValue={maxValue}
          showConfidenceIntervalsData={showConfidenceIntervalsData}
          polarity={polarity}
        />
      </Table>
      <DataSource dataSource={dataSource} />
    </div>
  );
}
