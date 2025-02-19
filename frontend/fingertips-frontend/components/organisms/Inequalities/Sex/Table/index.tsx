import { Paragraph, Table } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import {
  convertToPercentage,
  InequalitiesSexTableHeadingsEnum,
  InequalitiesSexTableRowData,
} from '@/lib/tableHelpers';
import { groupHealthDataByYear, Sex } from '../../inequalitiesHelpers';

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

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
});

const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
});

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightCell = styled(StyledTableCell)({
  textAlign: 'right',
});

const StyledParagraph = styled(Paragraph)({
  all: 'unset',
});

const mapToTableData = (
  groupedYearData: Record<number, HealthDataPoint[] | undefined>,
  englandBenchmarkData: Record<number, HealthDataPoint[] | undefined>
): InequalitiesSexTableRowData[] => {
  return Object.keys(groupedYearData).map((key) => ({
    period: Number(key),
    persons: groupedYearData[Number(key)]?.find((data) => data.sex === Sex.ALL)
      ?.value,
    male: groupedYearData[Number(key)]?.find((data) => data.sex === Sex.MALE)
      ?.value,
    female: groupedYearData[Number(key)]?.find(
      (data) => data.sex === Sex.FEMALE
    )?.value,
    englandBenchmark: englandBenchmarkData[Number(key)]?.at(0)?.value,
  }));
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

  const tableData = mapToTableData(yearlyHealthdata, yearlyEnglandData);
  return (
    <Table
      head={
        <>
          <Table.Row>
            <StyledAlignCenterHeader colSpan={4}>
              {healthIndicatorData.areaName}
            </StyledAlignCenterHeader>
            <Table.CellHeader></Table.CellHeader>
          </Table.Row>
          <Table.Row>
            {Object.values(InequalitiesSexTableHeadingsEnum).map(
              (heading, index) =>
                heading === InequalitiesSexTableHeadingsEnum.PERIOD ? (
                  <StyledAlignLeftHeader key={heading + index}>
                    {heading}
                  </StyledAlignLeftHeader>
                ) : (
                  <StyledAlignRightHeader key={heading + index}>
                    {heading}
                  </StyledAlignRightHeader>
                )
            )}
          </Table.Row>
        </>
      }
    >
      {tableData.map((data, index) => (
        <Table.Row key={data.period + index}>
          <StyledTableCell>{data.period}</StyledTableCell>
          <StyledAlignRightCell>
            {data.persons ? (
              convertToPercentage(data.persons)
            ) : (
              <StyledParagraph aria-label="Not Available">x</StyledParagraph>
            )}
          </StyledAlignRightCell>
          <StyledAlignRightCell>
            {data.male ? (
              convertToPercentage(data.male)
            ) : (
              <StyledParagraph aria-label="Not Available">x</StyledParagraph>
            )}
          </StyledAlignRightCell>
          <StyledAlignRightCell>
            {data.female ? (
              convertToPercentage(data.female)
            ) : (
              <StyledParagraph aria-label="Not Available">x</StyledParagraph>
            )}
          </StyledAlignRightCell>
          <StyledAlignRightCell>
            {data.englandBenchmark ? (
              convertToPercentage(data.englandBenchmark)
            ) : (
              <StyledParagraph aria-label="Not Available">x</StyledParagraph>
            )}
          </StyledAlignRightCell>
        </Table.Row>
      ))}
    </Table>
  );
}
