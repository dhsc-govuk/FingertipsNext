interface HeaderChartTitleProps {
  title: string;
}

export const HeaderChartTitle = ({
  title,
}: Readonly<HeaderChartTitleProps>) => {
  return (
    <div style={{ margin: '0px', padding: '0px' }}>
      <h3 style={{ margin: '0px', padding: '0px' }}>{title}</h3>
    </div>
  );
};
