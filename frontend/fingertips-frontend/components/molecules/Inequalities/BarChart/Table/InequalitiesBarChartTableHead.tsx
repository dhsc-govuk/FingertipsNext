import { Table } from 'govuk-react';
import {
  StyledAlignLeftHeader,
  StyledAlignRightHeader, StyledCenterTableHeader,
} from '@/lib/tableHelpers';
import React, { FC } from 'react';
import { StyledConfidenceLimitsHeader } from '@/components/organisms/LineChartTable';

export enum InequalitiesBarChartTableHeaders {
  INEQUALITY_TYPE = 'Inequality type',
  COMPARED_TO = 'Compared to persons',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

interface CellHeaderProps {
  header: InequalitiesBarChartTableHeaders;
  measurementUnit?: string;
}

const CellHeader: FC<CellHeaderProps> = ({ header, measurementUnit = '' }) => {

  if (header === InequalitiesBarChartTableHeaders.INEQUALITY_TYPE) {
    return (<StyledAlignLeftHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignLeftHeader>
    )
  } else if (header === InequalitiesBarChartTableHeaders.UPPER) {
    return (<StyledAlignRightHeader
      key={`heading-${header}`}
      style={{ width: '16%', paddingRight: '10px' }}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignRightHeader>
    )
  } else if (header === InequalitiesBarChartTableHeaders.COMPARED_TO ) {
    return ( <StyledCenterTableHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledCenterTableHeader> 
    )
  } else {
    return (<StyledAlignRightHeader
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
    )
  }
};

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
        <StyledConfidenceLimitsHeader colSpan={2} style={{ paddingRight: '10px', textAlign: 'center' }}>
          {confidenceLimit ? (
            <>
              {confidenceLimit}%<br />
              confidence
              <br />
              limits
            </>
          ) : null}
        </StyledConfidenceLimitsHeader>
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
