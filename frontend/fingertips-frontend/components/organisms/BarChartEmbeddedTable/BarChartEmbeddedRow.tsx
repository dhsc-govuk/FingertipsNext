import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { Table } from 'govuk-react';
import {
  CheckValueInTableCell,
  FormatNumberInTableCell,
} from '@/components/molecules/CheckValueInTableCell';
import { TrendTag } from '@/components/molecules/TrendTag';
import { SparklineChart } from '@/components/organisms/SparklineChart';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable/index';
import React, { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface BarChartEmbeddedRowProps {
  item: BarChartEmbeddedTableRow;
  maxValue: number;
  showConfidenceIntervalsData: boolean;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit?: string;
}

export const BarChartEmbeddedRow: FC<BarChartEmbeddedRowProps> = ({
  item,
  maxValue,
  showConfidenceIntervalsData,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit = '',
}) => {
  return (
    <Table.Row key={`${item.area}`}>
      <CheckValueInTableCell value={item.area} style={{textAlign: 'left'}} />
      <CheckValueInTableCell value={item.period} style={{textAlign: 'right'}} />
      <Table.Cell style={{textAlign: 'center'}}>
        <TrendTag trendFromResponse={item.trend} />
      </Table.Cell>
      <FormatNumberInTableCell value={item.count} numberStyle={'whole'} style={{textAlign: 'right'}} />
      <FormatNumberInTableCell
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
      <FormatNumberInTableCell value={item.lowerCi} style={{textAlign: 'right'}} />
      <FormatNumberInTableCell value={item.upperCi} style={{textAlign: 'right'}} />
    </Table.Row>
  );
};
