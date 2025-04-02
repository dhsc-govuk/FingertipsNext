'use client';

import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { H3, Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { StyledAlignLeftHeader } from '@/lib/tableHelpers';
import styled from 'styled-components';

const StyledAreaTitleHeader = styled(H3)({
  borderTop: `solid #F3F2F1 2px`, // aligns top to match grey heading cells
  textAlign: 'center',
});

export const StyledTableCell = styled(Table.Cell)(
  typography.font({ size: 16 }),
  {
    paddingRight: '0',
    textAlign: 'center',
  }
);

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

const getActualCount = (total: number, percent: number) => {
  // return (total * (percent ?? 0)) / 100
  return percent ?? 0;
};

interface PyramidTableProps {
  headers: string[];
  title: string;
  healthDataForArea: PopulationDataForArea | undefined;
  renderRow?: (header: string) => React.ReactNode | string;
}

export const PyramidTable = ({
  headers,
  healthDataForArea,
  title,
  renderRow,
}: PyramidTableProps) => {
  if (!healthDataForArea) return <></>;

  const indexes = getSortAgeBandIndexes(healthDataForArea?.ageCategories);
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
          return (
            <Table.Row key={`${healthDataForArea.areaName}-${index}`}>
              <StyledTableCell>
                {healthDataForArea.ageCategories[index]}
              </StyledTableCell>
              <StyledTableCell>
                {getActualCount(
                  healthDataForArea.populationCounts,
                  healthDataForArea.raw?.maleSeries[index]
                )}
              </StyledTableCell>
              <StyledTableCell>
                {getActualCount(
                  healthDataForArea.populationCounts,
                  healthDataForArea.raw?.femaleSeries[index]
                )}
              </StyledTableCell>
            </Table.Row>
          );
        })}
      </Table>
    </section>
  );
};
