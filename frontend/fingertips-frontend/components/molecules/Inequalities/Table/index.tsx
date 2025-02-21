import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import {
  getDisplayedValue,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledTableCellHeader,
} from '@/lib/tableHelpers';
import {
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ReactNode } from 'react';

export enum InequalitiesSexTableHeadingsEnum {
  PERIOD = 'Period',
}

export interface InequalitiesSexTableRowData {
  [key: string]: number | undefined;
}

interface InequalitiesSexTableProps {
  healthIndicatorData: HealthDataForArea;
  isSex?: boolean;
}

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

export const mapToInequalitiesTableData = (
  yearDataGroupedByInequalities: Record<
    string,
    Record<string, HealthDataPoint[] | undefined>
  >
): InequalitiesSexTableRowData[] => {
  return Object.keys(yearDataGroupedByInequalities).map((key) => {
    const dynamicFields = Object.keys(
      yearDataGroupedByInequalities[key]
    ).reduce((acc: Record<string, number | undefined>, current: string) => {
      acc[current] =
        yearDataGroupedByInequalities[key][current]?.at(0)?.value ?? undefined;
      return acc;
    }, {});

    return { period: Number(key), ...dynamicFields };
  });
};

const getCellHeader = (heading: string, index: number): ReactNode => {
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

export function InequalitiesTable({
  healthIndicatorData,
  isSex = true,
}: Readonly<InequalitiesSexTableProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(yearlyHealthdata);

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    isSex
  );

  const tableHeaders = [
    ...Object.values(InequalitiesSexTableHeadingsEnum),
    ...dynamicKeys,
  ];

  const tableData = mapToInequalitiesTableData(
    yearlyHealthDataGroupedByInequalities
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
            </Table.Row>
            <Table.Row>
              {tableHeaders.map((heading, index) =>
                getCellHeader(heading, index)
              )}
            </Table.Row>
          </>
        }
      >
        {tableData.map((data, index) => (
          <Table.Row key={data.period! + index}>
            <StyledAlignLeftTableCell>{data.period}</StyledAlignLeftTableCell>
            {dynamicKeys.map((key) => (
              <StyledAlignRightTableCell key={key}>
                {key === 'Persons'
                  ? getDisplayedValue(data['All'])
                  : getDisplayedValue(data[key])}
              </StyledAlignRightTableCell>
            ))}
          </Table.Row>
        ))}
      </Table>
    </StyledDiv>
  );
}
