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
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  CheckValueInTableCell,
  FormatNumberInTableCell,
} from '@/components/molecules/CheckValueInTableCell';
import React, { FC, Fragment, useState } from 'react';
import { SparklineChart } from '@/components/organisms/SparklineChart';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { TrendTag } from '@/components/molecules/TrendTag';
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRows } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedRows';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import {
  BarChartEmbeddedTableHeadingEnum,
  chartName,
  getFirstCompleteYear,
  getMaxValue,
} from '@/components/organisms/BarChartEmbeddedTable/barChartEmbeddedTableHelpers';

function sortByValueAndAreaName(
  a: BarChartEmbeddedTableRow,
  b: BarChartEmbeddedTableRow
): number {
  if (!a.value && !b.value) return 0;

  if (!a.value) return 1;

  if (!b.value) return -1;

  const valueResult = b.value - a.value;

  if (valueResult != 0) return valueResult;

  return a.area.localeCompare(b.area, undefined, { sensitivity: 'base' });
}

const ConfidenceLimitsHeader: FC<{ confidenceLimit?: number }> = ({
  confidenceLimit,
}) => {
  if (!confidenceLimit) return null;
  return (
    <>
      {confidenceLimit}%<br />
      confidence
      <br />
      limits
    </>
  );
};

interface BarChartEmbeddedTableProps {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  dataSource?: string;
}

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
  groupIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  dataSource,
}: Readonly<BarChartEmbeddedTableProps>) {
  const maxValue = getMaxValue(healthIndicatorData);
  const fullYear = getFirstCompleteYear(
    healthIndicatorData,
    benchmarkData,
    groupIndicatorData
  );

  const tableRows: BarChartEmbeddedTableRow[] = healthIndicatorData.map(
    (areaData) => {
      const point = areaData?.healthData.find(
        (point) => point.year === fullYear
      );

      if (!point) {
        return {
          area: areaData.areaName,
          year: fullYear,
        };
      }

      return {
        area: areaData.areaName,
        ...point,
      };
    }
  ) as BarChartEmbeddedTableRow[];
  //.filter(filterUndefined) as BarChartEmbeddedTableRow[];

  const sortedTableRows = tableRows.toSorted(sortByValueAndAreaName);

  const benchmarkDataPoint = benchmarkData?.healthData.find(
    (point) => point.year === fullYear
  );
  const groupDataPoint = groupIndicatorData?.healthData.find(
    (point) => point.year === fullYear
  );

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
        title={`Compared to England for ${fullYear} time period`}
      />

      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={5}></Table.CellHeader>
              <Table.CellHeader colSpan={2} style={{ textAlign: 'center' }}>
                <ConfidenceLimitsHeader confidenceLimit={confidenceLimit} />
              </Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BarChartEmbeddedTableHeadingEnum.AreaName}
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
        {benchmarkDataPoint ? (
          <Table.Row
            key={`${benchmarkData?.areaName}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-benchmark"
          >
            <CheckValueInTableCell
              value={`Benchmark: ${benchmarkData?.areaName}`}
              style={{ textAlign: 'left' }}
            />
            <Table.Cell style={{ textAlign: 'center' }}>
              <TrendTag trendFromResponse={benchmarkDataPoint.trend} />
            </Table.Cell>
            <FormatNumberInTableCell
              value={benchmarkDataPoint.count}
              numberStyle={'whole'}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={benchmarkDataPoint.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={[benchmarkDataPoint.value]}
                maxValue={maxValue}
                confidenceIntervalValues={[
                  benchmarkDataPoint.lowerCi,
                  benchmarkDataPoint.upperCi,
                ]}
                showConfidenceIntervalsData={showConfidenceIntervalsData}
                benchmarkOutcome={
                  benchmarkDataPoint.benchmarkComparison?.outcome
                }
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                label={AreaTypeLabelEnum.Benchmark}
                area={benchmarkData?.areaName}
                year={benchmarkDataPoint.year}
                measurementUnit={measurementUnit}
                barColor={GovukColours.DarkGrey}
              ></SparklineChart>
            </Table.Cell>
            <FormatNumberInTableCell
              value={benchmarkDataPoint.lowerCi}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={benchmarkDataPoint.upperCi}
              style={{ textAlign: 'right' }}
            />
          </Table.Row>
        ) : null}

        {groupDataPoint ? (
          <Table.Row
            key={`${groupIndicatorData?.areaName}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-group"
          >
            <CheckValueInTableCell
              value={`Group: ${groupIndicatorData?.areaName}`}
              style={{ textAlign: 'left' }}
            />
            <Table.Cell style={{ textAlign: 'center' }}>
              <TrendTag trendFromResponse={groupDataPoint.trend} />
            </Table.Cell>
            <FormatNumberInTableCell
              value={groupDataPoint.count}
              numberStyle={'whole'}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={groupDataPoint.value}
              style={{ textAlign: 'right', paddingRight: '0px' }}
            />
            <Table.Cell style={{ paddingRight: '0px' }}>
              <SparklineChart
                value={[groupDataPoint.value]}
                maxValue={maxValue}
                confidenceIntervalValues={[
                  groupDataPoint.lowerCi,
                  groupDataPoint.upperCi,
                ]}
                showConfidenceIntervalsData={showConfidenceIntervalsData}
                benchmarkOutcome={groupDataPoint.benchmarkComparison?.outcome}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                label={AreaTypeLabelEnum.Group}
                area={groupIndicatorData?.areaName}
                year={groupDataPoint.year}
                measurementUnit={measurementUnit}
                barColor={GovukColours.DarkGrey}
              />
            </Table.Cell>
            <FormatNumberInTableCell
              value={groupDataPoint.lowerCi}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={groupDataPoint.upperCi}
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
