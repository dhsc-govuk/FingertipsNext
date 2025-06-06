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
import React, { FC, useMemo, useState } from 'react';
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
  getLatestYearWithBenchmarks,
  getMaxValue,
} from '@/components/organisms/BarChartEmbeddedTable/barChartEmbeddedTableHelpers';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertBarChartEmbeddedTableToCsv } from '@/components/organisms/BarChartEmbeddedTable/convertBarChartEmbeddedTableToCsv';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { ContainerWithScrolling } from '@/components/atoms/ContainerWithScrolling/ContainerWithScrolling';

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
  benchmarkToUse: string;
  englandData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  indicatorMetadata?: IndicatorDocument;
}

export const BarChartEmbeddedTable: FC<BarChartEmbeddedTableProps> = ({
  healthIndicatorData,
  benchmarkToUse,
  englandData,
  groupIndicatorData,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  indicatorMetadata,
}) => {
  const { unitLabel: measurementUnit, dataSource } = indicatorMetadata ?? {};

  const maxValue = getMaxValue(healthIndicatorData);
  const fullYear = getLatestYearWithBenchmarks(
    healthIndicatorData,
    englandData,
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
          areaCode: areaData.areaCode,
          year: fullYear,
        } as BarChartEmbeddedTableRow;
      }

      return {
        area: areaData.areaName,
        areaCode: areaData.areaCode,
        ...point,
      };
    }
  );

  const sortedTableRows = tableRows.toSorted(sortByValueAndAreaName);
  const benchmarkAreaName =
    sortedTableRows[0].benchmarkComparison?.benchmarkAreaName;

  const englandDataPoint = englandData?.healthData.find(
    (point) => point.year === fullYear
  );
  const groupDataPoint = groupIndicatorData?.healthData.find(
    (point) => point.year === fullYear
  );

  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState(false);

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);

  let englandDataPointNamePrefix,
    groupDataPointNamePrefix,
    englandLabel,
    groupLabel,
    showComparisonLabels;
  if (benchmarkToUse === areaCodeForEngland) {
    englandDataPointNamePrefix = 'Benchmark: ';
    groupDataPointNamePrefix = 'Group: ';
    englandLabel = AreaTypeLabelEnum.Benchmark;
    groupLabel = AreaTypeLabelEnum.Group;
    showComparisonLabels = true;
  } else {
    englandDataPointNamePrefix = '';
    groupDataPointNamePrefix = 'Benchmark: ';
    englandLabel = AreaTypeLabelEnum.Area;
    groupLabel = AreaTypeLabelEnum.Benchmark;
    showComparisonLabels = false;
  }

  const id = 'barChartEmbeddedTable';

  const csvData = useMemo(
    () =>
      convertBarChartEmbeddedTableToCsv(
        sortedTableRows,
        fullYear,
        indicatorMetadata,
        englandData,
        groupIndicatorData,
        confidenceLimit
      ),
    [
      fullYear,
      sortedTableRows,
      indicatorMetadata,
      englandData,
      groupIndicatorData,
      confidenceLimit,
    ]
  );

  const title = `${indicatorMetadata?.indicatorName}, ${fullYear}`;

  return (
    <ContainerWithOutline>
      <div data-testid={`${id}-component`} id={id}>
        <ChartTitle>{title}</ChartTitle>
        <ConfidenceIntervalCheckbox
          chartName={chartName}
          showConfidenceIntervalsData={showConfidenceIntervalsData}
          setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
        />
        <BenchmarkLegend
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          polarity={polarity}
          title={`Compared to ${benchmarkAreaName}`}
        />
        <ContainerWithScrolling horizontal>
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
                  <Table.CellHeader
                    style={{ verticalAlign: 'top', paddingLeft: '10px' }}
                  >
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
                  <Table.CellHeader
                    style={{ verticalAlign: 'top', textAlign: 'right' }}
                  >
                    {BarChartEmbeddedTableHeadingEnum.Lower}
                  </Table.CellHeader>
                  <Table.CellHeader
                    style={{
                      verticalAlign: 'top',
                      textAlign: 'right',
                      paddingRight: '10px',
                    }}
                  >
                    {BarChartEmbeddedTableHeadingEnum.Upper}
                  </Table.CellHeader>
                </Table.Row>
              </React.Fragment>
            }
          >
            {englandDataPoint ? (
              <Table.Row
                key={`${englandData?.areaName}`}
                style={{ backgroundColor: GovukColours.LightGrey }}
                data-testid="table-row-benchmark"
              >
                <CheckValueInTableCell
                  value={`${englandDataPointNamePrefix}${englandData?.areaName}`}
                  style={{ textAlign: 'left', paddingLeft: '10px' }}
                />
                <Table.Cell style={{ textAlign: 'center' }}>
                  <TrendTag trendFromResponse={englandDataPoint.trend} />
                </Table.Cell>
                <FormatNumberInTableCell
                  value={englandDataPoint.count}
                  numberStyle={'whole'}
                  style={{ textAlign: 'right' }}
                />
                <FormatNumberInTableCell
                  value={englandDataPoint.value}
                  style={{
                    textAlign: 'right',
                    paddingRight: '0px',
                    paddingLeft: '20px',
                  }}
                />
                <Table.Cell style={{ paddingRight: '0px' }}>
                  <SparklineChart
                    value={[englandDataPoint.value]}
                    maxValue={maxValue}
                    confidenceIntervalValues={[
                      englandDataPoint.lowerCi,
                      englandDataPoint.upperCi,
                    ]}
                    showConfidenceIntervalsData={showConfidenceIntervalsData}
                    benchmarkOutcome={
                      englandDataPoint?.benchmarkComparison?.outcome
                    }
                    benchmarkComparisonMethod={benchmarkComparisonMethod}
                    polarity={polarity}
                    label={englandLabel}
                    area={englandData?.areaName}
                    year={englandDataPoint.year}
                    measurementUnit={measurementUnit}
                    barColor={GovukColours.DarkGrey}
                    showComparisonLabels={showComparisonLabels}
                  ></SparklineChart>
                </Table.Cell>
                <FormatNumberInTableCell
                  value={englandDataPoint.lowerCi}
                  style={{ textAlign: 'right' }}
                />
                <FormatNumberInTableCell
                  value={englandDataPoint.upperCi}
                  style={{ textAlign: 'right', paddingRight: '10px' }}
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
                  value={`${groupDataPointNamePrefix}${groupIndicatorData?.areaName}`}
                  style={{ textAlign: 'left', paddingLeft: '10px' }}
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
                  style={{
                    textAlign: 'right',
                    paddingRight: '0px',
                    paddingLeft: '20px',
                  }}
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
                    benchmarkOutcome={
                      groupDataPoint.benchmarkComparison?.outcome
                    }
                    benchmarkComparisonMethod={benchmarkComparisonMethod}
                    polarity={polarity}
                    label={groupLabel}
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
                  style={{ textAlign: 'right', paddingRight: '10px' }}
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
        </ContainerWithScrolling>
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton targetId={id} csvData={csvData} />
      <DataSource dataSource={dataSource} />
    </ContainerWithOutline>
  );
};
