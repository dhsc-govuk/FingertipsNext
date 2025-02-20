import { Table } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { Sex } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { GovukColours } from '../styleHelpers/colours';

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
  count?: number;
  value?: number;
  lower?: number;
  upper?: number;
}

export interface InequalitiesSexTableRowData {
  period: number;
  persons?: number;
  male?: number;
  female?: number;
  englandBenchmark?: number;
}

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
  backgroundColor: GovukColours.MidGrey,
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
  backgroundColor: GovukColours.MidGrey,
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

// When value is undefined, it returns an X with an aria-label for screen readers.
export const convertToPercentage = (value?: number): React.ReactNode => {
  if (value === undefined) {
    return (
      <span aria-label="Not available" data-testid="not-available">
        <span aria-hidden="true">X</span>
      </span>
    );
  }
  return `${((value / 10000) * 100).toFixed(1)}%`;
};

export const mapToLineChartTableData = (
  areaData: HealthDataForArea
): LineChartTableRowData[] =>
  areaData.healthData.map((healthPoint) => ({
    period: healthPoint.year,
    count: healthPoint.count,
    value: healthPoint.value,
    lower: healthPoint.lowerCi,
    upper: healthPoint.upperCi,
  }));

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
    englandBenchmark: englandBenchmarkData[Number(key)]?.find(
      (data) => data.sex === Sex.ALL
    )?.value,
  }));
};
