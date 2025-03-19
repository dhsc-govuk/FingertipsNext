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

export const StyledAlignLeftTableCellNoPadding = styled(
  StyledAlignLeftTableCell
)({
  padding: 0,
  height: '2.8125em', //45px
});

interface InequalitiesBarChartTableProps {
  tableData: InequalitiesBarChartData;
  type?: InequalitiesTypes;
  measurementUnit?: string;
}

export function InequalitiesBarChartTable({
  tableData,
  type = InequalitiesTypes.Sex,
  measurementUnit,
}: Readonly<InequalitiesBarChartTableProps>) {
  const { areaName, data } = tableData;
  const inequalities = { ...data.inequalities };
  const { sortedKeys, disAggregateKeys } = getAggregatePointInfo(inequalities);

  if (type === InequalitiesTypes.Sex) sortedKeys.reverse();

  return (
    <div data-testid="inequalitiesBarChartTable-component">
      <Table
        head={
          <InequalitiesBarChartTableHead
            areaName={areaName}
            measurementUnit={measurementUnit}
          />
        }
      >
        {sortedKeys.map((key) => (
          <Table.Row key={key}>
            <StyledAlignLeftTableCell>{key}</StyledAlignLeftTableCell>
            <StyledAlignLeftTableCellNoPadding>
              {disAggregateKeys.includes(key) ? (
                <InequalitiesBenchmarkLabel
                  comparison={inequalities[key]?.benchmarkComparison}
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
