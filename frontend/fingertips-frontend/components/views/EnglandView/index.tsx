import { getChartListForView, IViewProps } from '@/lib/viewUtils/viewUtils';
import { H2 } from 'govuk-react';

export function EnglandView({ areaCodes, indicatorsSelected }: IViewProps) {
  const chartList = getChartListForView(indicatorsSelected, 'englandView');

  return (
    <>
      <p>Backlink?</p>
      <H2>View data for England</H2>
      <p>
        fetch data for area {areaCodes.toString()} and indicator{' '}
        {indicatorsSelected.toString()}
      </p>
      <p>show the charts</p>
      <ul>
        {chartList
          ? chartList.map((chart) => <li key={chart}>{chart}</li>)
          : null}
      </ul>
    </>
  );
}
