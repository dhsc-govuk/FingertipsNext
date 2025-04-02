'use client';

import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { Label, Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { StyledAlignLeftHeader } from '@/lib/tableHelpers';
import styled from 'styled-components';

const StyledAreaTitleHeader = styled(Label)({
  textAlign: 'center',
  maxHeight: '45px',
  minHeight: '45px',
  wordWrap: 'break-word',
  border: '0px',
  padding: '0px',
  display: 'block',
  fontSize: '19px',
  letterSpacing: '0px',
  fontWeight: '700',
});

export const StyledTableCell = styled(Table.Cell)(
  typography.font({ size: 16 }),
  {
    paddingRight: '0',
    textAlign: 'center',
  }
);

const valueFormatter = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return value?.toLocaleString();
  }
  return value;
};

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  borderTop: `solid #F3F2F1 2px`, // aligns top to match grey heading cells
  textAlign: 'center',
});

const getSortAgeBandIndexes = (ageBands: string[] | undefined): number[] => {
  if (!ageBands) return [];

  return ageBands
    .map((item, index) => ({ index, value: item }))
    .sort((a, b) => {
      const getLowerBandValue = (range: string) => {
        if (range.includes('+')) return parseInt(range.split('-')[0]);
        return parseInt(range.split('-')[0]);
      };
      return getLowerBandValue(a.value) - getLowerBandValue(b.value);
    })
    .map((item) => item.index);
};

interface PyramidTableProps {
  headers: string[];
  title: string;
  healthDataForArea: PopulationDataForArea | undefined;
  filterValues?: (
    header: (string | undefined | number)[]
  ) => (string | undefined | number)[];
}

export const PyramidTable = ({
  headers,
  healthDataForArea,
  title,
  filterValues,
}: PyramidTableProps) => {
  if (!healthDataForArea) return <></>;

  const indexes = getSortAgeBandIndexes(healthDataForArea?.ageCategories);

  const points = healthDataForArea.ageCategories.map((value, index) => [
    value,
    healthDataForArea.raw?.femaleSeries[index],
    healthDataForArea.raw?.maleSeries[index],
  ]);
  return (
    <section>
      <StyledAreaTitleHeader>{title}</StyledAreaTitleHeader>

      <Table
        head={
          <Table.Row>
            {headers.map((header) => {
              return (
                <StyledAreaNameHeader key={header}>
                  {header}
                </StyledAreaNameHeader>
              );
            })}
          </Table.Row>
        }
      >
        {indexes.map((index, _) => {
          const columnValues = filterValues
            ? filterValues(points[index])
            : points[index];

          return (
            <Table.Row key={`${healthDataForArea.areaName}-${index}`}>
              {columnValues.map((value, valueIndex: number) => (
                <StyledTableCell
                  key={`${healthDataForArea.areaName}-${index}-${valueIndex}`}
                >
                  {valueFormatter(value)}
                </StyledTableCell>
              ))}
            </Table.Row>
          );
        })}
      </Table>
    </section>
  );
};
