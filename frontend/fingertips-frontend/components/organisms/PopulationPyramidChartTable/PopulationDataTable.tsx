'use client';

import {
  PopulationDataForArea,
  getLowerBandValue,
} from '@/lib/chartHelpers/preparePopulationData';
import { Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { StyledAlignLeftHeader } from '@/lib/tableHelpers';
import styled from 'styled-components';
import { formatWholeNumber } from '@/lib/numberFormatter';

const StyledAreaTitleHeader = styled('h3')(typography.font({ size: 19 }), {
  textAlign: 'center',
  height: '65px',
  lineHeight: '65px',
  letterSpacing: '0px',
  fontWeight: '700',
  padding: '5px',
});

export const StyledTableCell = styled(Table.Cell)(
  typography.font({ size: 19 }),
  {
    paddingRight: '0',
    textAlign: 'center',
  }
);

const valueFormatter = (value: number | string | undefined) => {
  if (typeof value === 'number' || typeof value === 'undefined') {
    return formatWholeNumber(value);
  }
  return value;
};

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)(
  typography.font({ size: 19 }),
  {
    borderTop: `solid #F3F2F1 2px`,
    textAlign: 'center',
    fontWeight: 700,
  }
);

const getSortAgeBandIndexes = (ageBands: string[] | undefined): number[] => {
  if (!ageBands) return [];

  return ageBands
    .map((item, index) => ({ index, value: item }))
    .sort((a, b) => {
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

const computeFooterItems = (
  maleSeries: (number | undefined)[],
  femaleSeries: (number | undefined)[]
): ItemDataType[] => {
  const males = maleSeries.reduce((prev, current) => {
    return (prev ?? 0) + (current ?? 0);
  }, 0);

  const females = femaleSeries.reduce((prev, current) => {
    return (prev ?? 0) + (current ?? 0);
  }, 0);

  return ['All ages', males, females];
};

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
    healthDataForArea.femaleSeries[index],
    healthDataForArea.maleSeries[index],
  ]);

  const footerRowItems = computeFooterItems(
    healthDataForArea.maleSeries,
    healthDataForArea.femaleSeries
  );
  const filterFooterRowItems = filterValues
    ? filterValues(footerRowItems)
    : footerRowItems;
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
        {indexes.map((index) => {
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
        <Table.Row key={`footer-${healthDataForArea.areaName}`}>
          {filterFooterRowItems.map((value, valueIndex: number) => (
            <StyledAreaNameHeader
              key={`footer-${healthDataForArea.areaName}-${valueIndex}`}
            >
              {valueFormatter(value)}
            </StyledAreaNameHeader>
          ))}
        </Table.Row>
      </Table>
    </section>
  );
};
