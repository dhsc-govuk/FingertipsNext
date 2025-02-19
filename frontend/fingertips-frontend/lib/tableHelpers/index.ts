import { Table } from 'govuk-react';
import { LIGHT_GREY } from '../chartHelpers/chartHelpers';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { Sex } from '@/components/organisms/Inequalities/inequalitiesHelpers';

export enum LineChartTableHeadingEnum {
  AreaPeriod = 'Period',
  BenchmarkTrend = 'Compared to benchmark',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
  BenchmarkValue = 'Value ',
}

export enum InequalitiesSexTableHeadingsEnum {
  PERIOD = 'Period',
  PERSONS = 'Persons',
  MALE = 'Male',
  FEMALE = 'Female',
  BENCHMARK = 'England benchmark',
}

export interface LineChartTableRowData {
  period: number;
  count: number;
  value: number;
  lower: number;
  upper: number;
}

export interface InequalitiesSexTableRowData {
  period: number;
  persons: number | undefined;
  male: number | undefined;
  female: number | undefined;
  englandBenchmark: number | undefined;
}

export const convertToPercentage = (value: number): string => {
  // dummy function to do percentage conversions until real conversion logic is provided
  return `${((value / 10000) * 100).toFixed(1)}%`;
};

export const mapToInequalitiesSexTableData = (
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

export const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

export const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
  paddingRight: '10px',
  verticalAlign: 'top',
});

export const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid #F3F2F1 2px`,
  width: '16%',
});

export const StyledTableCell = styled(Table.Cell)(
  typography.font({ size: 14 }),
  {
    paddingRight: '0',
  }
);

export const StyledAlignRightTableCell = styled(StyledTableCell)({
  textAlign: 'right',
  paddingRight: '10px',
});

export const StyledGreyTableCellValue = styled(StyledAlignRightTableCell)({
  backgroundColor: LIGHT_GREY,
  borderTop: `solid #F3F2F1 2px`,
});

export const StyledAlignLeftTableCell = styled(StyledTableCell)({
  textAlign: 'left',
  width: '10%',
});

export const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
  verticalAlign: 'top',
});

export const StyledDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
