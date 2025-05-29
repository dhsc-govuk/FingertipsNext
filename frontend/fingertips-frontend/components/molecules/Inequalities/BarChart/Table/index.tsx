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
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

interface InequalitiesBarChartTableProps {
  tableData: InequalitiesBarChartData;
  type?: InequalitiesTypes;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function InequalitiesBarChartTable({
  tableData,
  type = InequalitiesTypes.Sex,
  measurementUnit,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}: Readonly<InequalitiesBarChartTableProps>) {
  const { areaName, data } = tableData;
  const inequalities = { ...data.inequalities };
  const { sortedKeys, inequalityDimensions } =
    getAggregatePointInfo(inequalities);

  // for sex inequality we always want Persons, Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) sortedKeys.reverse();

  // TODO: Call the function to convert CSV data
  const csvData: CsvData = [
    ['Column One', 'Column Two'],
    [1, 'A'],
  ];

  const id = 'inequalitiesBarChartTable';
  return (
    <>
      <div data-testid={`${id}-component`}>
        <Table
          id={id}
          head={
            <InequalitiesBarChartTableHead
              areaName={areaName}
              measurementUnit={measurementUnit}
              confidenceLimit={getConfidenceLimitNumber(
                benchmarkComparisonMethod
              )}
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
      </div>
      <ExportOptionsButton targetId={id} csvData={csvData} />
    </>
  );
}
