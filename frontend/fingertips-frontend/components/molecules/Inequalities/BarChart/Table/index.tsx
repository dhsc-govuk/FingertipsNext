import {
  InequalitiesBarChartData,
  InequalitiesTypes,
  inequalityKeyMapping,
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
  const keys = Object.keys(inequalities);
  const sortedKeys = inequalityKeyMapping[type](keys);

  // remove the benchmark comparison from the primary row as this benchmark is against england, not used in this table
  const primaryKey = sortedKeys[0] as keyof typeof inequalities;
  inequalities[primaryKey] = {
    ...inequalities[primaryKey],
    benchmarkComparison: undefined,
  };

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
              <InequalitiesBenchmarkLabel
                comparison={inequalities[key]?.benchmarkComparison}
              />
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
