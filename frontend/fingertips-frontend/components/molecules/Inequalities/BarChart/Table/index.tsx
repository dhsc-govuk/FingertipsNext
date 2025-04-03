import {
  getAggregatePointInfo,
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  getDisplayedValue,
  StyledAlignLeftTableCell,
  StyledAlignRightTableCell,
} from '@/lib/tableHelpers';
import { Table } from 'govuk-react';
import React from 'react';
import { InequalitiesBarChartTableHead } from '@/components/molecules/Inequalities/BarChart/Table/InequalitiesBarChartTableHead';
import { InequalitiesBenchmarkLabel } from '@/components/molecules/Inequalities/BarChart/Table/InequalitiesBenchmarkLabel';
import styled from 'styled-components';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';

const StyledAlignLeftTableCellNoPadding = styled(StyledAlignLeftTableCell)({
  padding: 0,
  height: '2.8125em', //45px
});

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

  return (
    <div data-testid="inequalitiesBarChartTable-component">
      <Table
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
            <StyledAlignLeftTableCell>{key}</StyledAlignLeftTableCell>
            <StyledAlignLeftTableCellNoPadding>
              {inequalityDimensions.includes(key) ? (
                <InequalitiesBenchmarkLabel
                  benchmarkComparisonMethod={benchmarkComparisonMethod}
                  comparison={inequalities[key]?.benchmarkComparison}
                  polarity={polarity}
                />
              ) : null}
            </StyledAlignLeftTableCellNoPadding>
            <StyledAlignRightTableCell>
              {getDisplayedValue(inequalities[key]?.count)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(inequalities[key]?.value)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(inequalities[key]?.lower)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(inequalities[key]?.upper)}
            </StyledAlignRightTableCell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
