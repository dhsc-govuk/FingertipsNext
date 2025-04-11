import { Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

interface DataSourceProps {
  dataSource?: string;
}

export function DataSource({ dataSource }: Readonly<DataSourceProps>) {
  return dataSource ? (
    <div data-testid={'data-source'}>
      <StyledParagraphDataSource>
        {`Data source: ${dataSource}`}
      </StyledParagraphDataSource>
    </div>
  ) : null;
}
