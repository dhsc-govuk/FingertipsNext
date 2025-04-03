'use client';

import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { StyledAlignLeftHeader } from '@/lib/tableHelpers';
import styled from 'styled-components';

const StyledAreaTitleHeader = styled('h3')(typography.font({ size: 19 }), {
  textAlign: 'center',
  height: '70px',
  border: '0px',
  margin: '5px',
  display: 'block',
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
  borderTop: `solid #F3F2F1 2px`,
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

type ItemDataType = string | undefined | number;

interface PopulationDataTableProps {
  headers: string[];
  title: string;
  healthDataForArea: PopulationDataForArea | undefined;
  filterValues?: (header: ItemDataType[]) => ItemDataType[];
}

export const PopulationDataTable = ({
  headers,
  healthDataForArea,
  title,
  filterValues,
}: PopulationDataTableProps) => {
  if (!healthDataForArea) return <></>;

  const indexes = getSortAgeBandIndexes(healthDataForArea?.ageCategories);

  const points = healthDataForArea.ageCategories.map((value, index) => [
    value,
    healthDataForArea.raw?.femaleSeries[index],
    healthDataForArea.raw?.maleSeries[index],
  ]);

  const footerRowItems = ((): ItemDataType[] => {
    const males = healthDataForArea.raw?.maleSeries.reduce((prev, current) => {
      return (prev ?? 0) + (current ?? 0);
    }, 0);

    const females = healthDataForArea.raw?.femaleSeries.reduce(
      (prev, current) => {
        return (prev ?? 0) + (current ?? 0);
      },
      0
    );

    return ['All ages', males, females];
  })();

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

        {(() => {
          const items = filterValues
            ? filterValues(footerRowItems)
            : footerRowItems;
          return (
            <Table.Row key={`footer-${healthDataForArea.areaName}`}>
              {items.map((value, valueIndex: number) => (
                <StyledAreaNameHeader
                  key={`footer-${healthDataForArea.areaName}-${valueIndex}`}
                >
                  {valueFormatter(value)}
                </StyledAreaNameHeader>
              ))}
            </Table.Row>
          );
        })()}
      </Table>
    </section>
  );
};
