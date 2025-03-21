import { H5 } from 'govuk-react';

interface HeaderChartTitleProps {
  title: string;
}

export const HeaderChartTitle = ({
  title,
}: Readonly<HeaderChartTitleProps>) => {
  return (
    <div style={{ margin: '0px', padding: '0px' }}>
      <H5 style={{ margin: '0px', padding: '0px' }}>{title}</H5>
    </div>
  );
};
