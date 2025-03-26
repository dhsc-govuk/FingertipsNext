import { Table } from 'govuk-react';
import {
  StyledAlignLeftHeader,
  StyledAlignRightHeader,
} from '@/lib/tableHelpers';
import React, { FC } from 'react';

export enum InequalitiesBarChartTableHeaders {
  INEQUALITY_TYPE = 'Inequality type',
  COMPARED_TO = 'Compared to Persons',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

interface CellHeaderProps {
  header: InequalitiesBarChartTableHeaders;
  measurementUnit?: string;
}

const CellHeader: FC<CellHeaderProps> = ({ header, measurementUnit = '' }) =>
  header === InequalitiesBarChartTableHeaders.INEQUALITY_TYPE ||
  header === InequalitiesBarChartTableHeaders.COMPARED_TO ? (
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
  confidenceLimit?: number;
}

export const InequalitiesBarChartTableHead = ({
  areaName,
  measurementUnit = '',
  confidenceLimit = 0,
}: Readonly<InequalitiesBarChartTableHeadProps>) => {
  return (
    <>
      <Table.Row>
        <StyledAlignLeftHeader colSpan={4}>{areaName}</StyledAlignLeftHeader>
        <StyledAlignRightHeader colSpan={2} style={{ paddingRight: '20px' }}>
          {confidenceLimit ? `${confidenceLimit}% confidence limits` : null}
        </StyledAlignRightHeader>
      </Table.Row>
      <Table.Row>
        {Object.values(InequalitiesBarChartTableHeaders).map((header) => (
          <CellHeader
            header={header}
            measurementUnit={measurementUnit}
            key={header}
          />
        ))}
      </Table.Row>
    </>
  );
};
