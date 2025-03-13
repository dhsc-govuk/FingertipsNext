import { Table } from 'govuk-react';
import {
  StyledAlignLeftHeader,
  StyledAlignRightHeader,
} from '@/lib/tableHelpers';
import React, { ReactNode } from 'react';

export enum InequalitiesBarChartTableHeaders {
  INEQUALITY_TYPE = 'Inequality type',
  COMPARED_TO = 'Compared to Persons',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

const getCellHeader = (
  header: InequalitiesBarChartTableHeaders,
  measurementUnit = ''
): ReactNode =>
  header === InequalitiesBarChartTableHeaders.INEQUALITY_TYPE ? (
    <StyledAlignLeftHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignLeftHeader>
  ) : (
    <StyledAlignRightHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header === InequalitiesBarChartTableHeaders.VALUE && measurementUnit ? (
        <>
          {header}
          <span
            data-testid="inequalitiesBarChart-measurementUnit"
            style={{ display: 'block', margin: 'auto' }}
          >{` ${measurementUnit}`}</span>
        </>
      ) : (
        header
      )}
    </StyledAlignRightHeader>
  );

interface InequalitiesBarChartTableHeadProps {
  areaName: string;
  measurementUnit?: string;
}

export const InequalitiesBarChartTableHead = ({
  areaName,
  measurementUnit = '',
}: Readonly<InequalitiesBarChartTableHeadProps>) => {
  return (
    <>
      <Table.Row>
        <StyledAlignLeftHeader colSpan={4}>{areaName}</StyledAlignLeftHeader>
        <StyledAlignRightHeader colSpan={2} style={{ paddingRight: '20px' }}>
          95% confidence limits
        </StyledAlignRightHeader>
      </Table.Row>
      <Table.Row>
        {Object.values(InequalitiesBarChartTableHeaders).map((header) =>
          getCellHeader(header, measurementUnit)
        )}
      </Table.Row>
    </>
  );
};
