'use client';

import {
  PopulationDataForArea,
  getLowerBandValue,
} from '@/lib/chartHelpers/preparePopulationData';
import { Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { StyledAlignLeftHeader, StyledTableCell } from '@/lib/tableHelpers';
import styled from 'styled-components';
import { formatWholeNumber } from '@/lib/numberFormatter';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyledAreaTitleHeader = styled('h3')(typography.font({ size: 19 }), {
  textAlign: 'center',
  height: '65px',
  lineHeight: '65px',
  letterSpacing: '0px',
  fontWeight: '700',
});

const valueFormatter = (value: number | string | undefined) => {
  if (typeof value === 'number' || typeof value === 'undefined') {
    return formatWholeNumber(value);
  }
  return value;
};

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)(
  typography.font({ size: 19 }),
  {
    borderTop: `solid ${GovukColours.LightGrey} 2px`,
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

interface FilterItemDataType {
  age: string | undefined;
  male: number;
  female: number;
}

interface PopulationDataTableProps {
  headers: string[];
  title: string;
  healthDataForArea: PopulationDataForArea | undefined;
  filterValues?: (header: FilterItemDataType) => ItemDataType[];
}

const computeFooterItems = (
  maleSeries: (number | undefined)[],
  femaleSeries: (number | undefined)[]
): FilterItemDataType => {
  const totalMales = maleSeries.reduce((prev, current) => {
    return (prev ?? 0) + (current ?? 0);
  }, 0);

  const totalFemales = femaleSeries.reduce((prev, current) => {
    return (prev ?? 0) + (current ?? 0);
  }, 0);

  return { age: 'All ages', male: totalMales ?? 0, female: totalFemales ?? 0 };
};

export const PopulationPyramidTable = ({
  headers,
  healthDataForArea,
  title,
  filterValues,
}: PopulationDataTableProps) => {
  if (!healthDataForArea) return <></>;

  const indexes = getSortAgeBandIndexes(healthDataForArea?.ageCategories);

  const points = healthDataForArea.ageCategories.map(
    (value: string, index: number): FilterItemDataType => {
      return {
        age: value,
        male: healthDataForArea.maleSeries[index],
        female: healthDataForArea.femaleSeries[index],
      };
    }
  );

  const footerRowItems = computeFooterItems(
    healthDataForArea.maleSeries,
    healthDataForArea.femaleSeries
  );
  const filterFooterRowItems = filterValues
    ? filterValues(footerRowItems)
    : [footerRowItems.age, footerRowItems.male, footerRowItems.female];
  return (
    <section>
      <StyledAreaTitleHeader>{title}</StyledAreaTitleHeader>

      <Table
        head={
          <Table.Row>
            {headers.map((header) => {
              return (
                <StyledAreaNameHeader
                  key={header}
                  style={{ whiteSpace: 'nowrap' }}
                >
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
            : [points[index].age, points[index].male, points[index].female];
          return (
            <Table.Row key={`${healthDataForArea.areaName}-${index}`}>
              {columnValues.map((value, valueIndex: number) => (
                <StyledTableCell
                  key={`${healthDataForArea.areaName}-${index}-${valueIndex}`}
                  style={{ whiteSpace: 'nowrap' }}
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
