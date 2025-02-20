import { Table } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  convertToPercentage,
  InequalitiesSexTableHeadingsEnum,
  mapToInequalitiesSexTableData,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledDiv,
  StyledGreyHeader,
  StyledGreyTableCellValue,
} from '@/lib/tableHelpers';
import { groupHealthDataByYear } from '../../inequalitiesHelpers';
import { ReactNode } from 'react';

interface InequalitiesSexTableProps {
  healthIndicatorData: HealthDataForArea;
  englandBenchmarkData: HealthDataForArea | undefined;
}

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledTableCell = styled(Table.Cell)(typography.font({ size: 14 }));

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightCell = styled(StyledTableCell)({
  textAlign: 'right',
});

const getCellHeader = (
  heading: InequalitiesSexTableHeadingsEnum,
  index: number
): ReactNode => {
  if (heading === InequalitiesSexTableHeadingsEnum.BENCHMARK) {
    return (
      <StyledGreyHeader
        data-testid={`header-${heading}-${index}`}
        key={heading + index}
      >
        {heading}
      </StyledGreyHeader>
    );
  }

  return heading === InequalitiesSexTableHeadingsEnum.PERIOD ? (
    <StyledAlignLeftHeader
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignLeftHeader>
  ) : (
    <StyledAlignRightHeader
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignRightHeader>
  );
};

export function InequalitiesSexTable({
  healthIndicatorData,
  englandBenchmarkData,
}: Readonly<InequalitiesSexTableProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );
  const yearlyEnglandData = englandBenchmarkData
    ? groupHealthDataByYear(englandBenchmarkData.healthData)
    : [];

  const tableData = mapToInequalitiesSexTableData(
    yearlyHealthdata,
    yearlyEnglandData
  );
  return (
    <StyledDiv data-testid="inequalitiesSexTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignCenterHeader colSpan={4}>
                {healthIndicatorData.areaName}
              </StyledAlignCenterHeader>
              <StyledGreyHeader></StyledGreyHeader>
            </Table.Row>
            <Table.Row>
              {Object.values(InequalitiesSexTableHeadingsEnum).map(
                (heading, index) => getCellHeader(heading, index)
              )}
            </Table.Row>
          </>
        }
      >
        {tableData.map((data, index) => (
          <Table.Row key={data.period + index}>
            <StyledAlignLeftTableCell>{data.period}</StyledAlignLeftTableCell>
            <StyledAlignRightCell>
              {convertToPercentage(data.persons)}
            </StyledAlignRightCell>
            <StyledAlignRightCell>
              {convertToPercentage(data.male)}
            </StyledAlignRightCell>
            <StyledAlignRightCell>
              {convertToPercentage(data.female)}
            </StyledAlignRightCell>
            <StyledGreyTableCellValue>
              {convertToPercentage(data.englandBenchmark)}
            </StyledGreyTableCellValue>
          </Table.Row>
        ))}
      </Table>
    </StyledDiv>
  );
}
