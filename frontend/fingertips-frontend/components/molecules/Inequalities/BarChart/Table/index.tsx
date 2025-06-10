import {
  getAggregatePointInfo,
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  getDisplayValue,
  getDisplayWholeNumber,
  StyledAlignLeftTableCellPaddingLeft,
  StyledAlignRightTableCell,
  StyledAlignRightTableCellPaddingRight,
  StyledCenterTableCell,
} from '@/lib/tableHelpers';
import { Table } from 'govuk-react';
import React from 'react';
import { InequalitiesBarChartTableHead } from '@/components/molecules/Inequalities/BarChart/Table/InequalitiesBarChartTableHead';
import { InequalitiesBenchmarkLabel } from '@/components/molecules/Inequalities/BarChart/Table/InequalitiesBenchmarkLabel';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { convertInequalitiesOverTimeTableToCsvData } from './convertInequalitiesOverTimeTableToCsvData';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';

interface InequalitiesBarChartTableProps {
  title: string;
  tableData: InequalitiesBarChartData;
  type?: InequalitiesTypes;
  indicatorMetadata?: IndicatorDocument;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  inequalityTypeSelected: string;
}

export function InequalitiesBarChartTable({
  title,
  tableData,
  type = InequalitiesTypes.Sex,
  indicatorMetadata,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  inequalityTypeSelected,
}: Readonly<InequalitiesBarChartTableProps>) {
  const { data } = tableData;
  const inequalities = { ...data.inequalities };
  const { sortedKeys, inequalityDimensions } =
    getAggregatePointInfo(inequalities);

  // for sex inequality we always want Persons, Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) sortedKeys.reverse();

  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);

  const csvData = convertInequalitiesOverTimeTableToCsvData(
    sortedKeys,
    tableData,
    inequalityTypeSelected,
    confidenceLimit,
    indicatorMetadata
  );

  const id = 'inequalitiesBarChartTable';
  return (
    <>
      <div data-testid={`${id}-component`} id={id}>
        <ChartTitle>{title}</ChartTitle>
        <Table
          head={
            <InequalitiesBarChartTableHead
              measurementUnit={indicatorMetadata?.unitLabel}
              confidenceLimit={confidenceLimit}
            />
          }
        >
          {sortedKeys.map((key) => (
            <Table.Row key={key}>
              <StyledAlignLeftTableCellPaddingLeft>
                {key}
              </StyledAlignLeftTableCellPaddingLeft>
              <StyledCenterTableCell>
                {inequalityDimensions.includes(key) ? (
                  <InequalitiesBenchmarkLabel
                    benchmarkComparisonMethod={benchmarkComparisonMethod}
                    comparison={inequalities[key]?.benchmarkComparison}
                    polarity={polarity}
                  />
                ) : null}
              </StyledCenterTableCell>
              <StyledAlignRightTableCell>
                {getDisplayWholeNumber(inequalities[key]?.count)}
              </StyledAlignRightTableCell>
              <StyledAlignRightTableCell>
                {getDisplayValue(inequalities[key]?.value)}
              </StyledAlignRightTableCell>
              <StyledAlignRightTableCell>
                {getDisplayValue(inequalities[key]?.lower)}
              </StyledAlignRightTableCell>
              <StyledAlignRightTableCellPaddingRight>
                {getDisplayValue(inequalities[key]?.upper)}
              </StyledAlignRightTableCellPaddingRight>
            </Table.Row>
          ))}
        </Table>
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton targetId={id} csvData={csvData} />
    </>
  );
}
