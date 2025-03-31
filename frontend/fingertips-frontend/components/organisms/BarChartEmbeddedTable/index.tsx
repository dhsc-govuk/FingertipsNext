'use client';

import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import {
  getConfidenceLimitNumber,
  getMostRecentData,
  sortHealthDataByYearDescending,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';
import React, { useState } from 'react';
import { SparklineChart } from '@/components/organisms/SparklineChart';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { TrendTag } from '@/components/molecules/TrendTag';
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  RecentTrend = 'Recent trend',
  Period = 'Period',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
}

export enum SparklineLabelEnum {
  Benchmark = 'Benchmark',
  Group = 'Group',
  Area = 'Area',
}

interface BarChartEmbeddedTableProps {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
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
    trend: item.healthData[0].trend,
    count: item.healthData[0].count,
    value: item.healthData[0].value,
    lowerCi: item.healthData[0].lowerCi,
    upperCi: item.healthData[0].upperCi,
    benchmarkComparison: item.healthData[0].benchmarkComparison,
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

  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState(false);

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  return (
    <div data-testid={'barChartEmbeddedTable-component'}>
      <BenchmarkLegend
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
      />
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
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.AreaName}
              </Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader>
                {BarChartEmbeddedTableHeadingEnum.RecentTrend}
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
            <Table.Cell>
              <TrendTag trendFromResponse={mostRecentBenchmarkData.trend} />
            </Table.Cell>
            <CheckValueInTableCell value={mostRecentBenchmarkData.count} />
            <CheckValueInTableCell
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
                label={SparklineLabelEnum.Benchmark}
                area={benchmarkData?.areaName}
                year={mostRecentBenchmarkData.year}
                measurementUnit={measurementUnit}
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
            <Table.Cell>
              <TrendTag trendFromResponse={mostRecentGroupData.trend} />
            </Table.Cell>
            <CheckValueInTableCell value={mostRecentGroupData.count} />
            <CheckValueInTableCell
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
                label={SparklineLabelEnum.Group}
                area={groupIndicatorData?.areaName}
                year={mostRecentGroupData.year}
                measurementUnit={measurementUnit}
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
            <Table.Cell>
              <TrendTag trendFromResponse={item.trend} />
            </Table.Cell>
            <CheckValueInTableCell value={item.count} />
            <CheckValueInTableCell
              value={item.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={[item.value]}
                maxValue={maxValue}
                confidenceIntervalValues={[item.lowerCi, item.upperCi]}
                showConfidenceIntervalsData={showConfidenceIntervalsData}
                benchmarkOutcome={item.benchmarkComparison?.outcome}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                label={SparklineLabelEnum.Area}
                area={item.area}
                year={item.period}
                measurementUnit={measurementUnit}
              />
            </Table.Cell>
            <CheckValueInTableCell value={item.lowerCi} />
            <CheckValueInTableCell value={item.upperCi} />
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
