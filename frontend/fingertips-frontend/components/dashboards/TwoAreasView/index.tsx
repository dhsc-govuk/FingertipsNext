import { getChartListForView, IViewProps } from '@/lib/viewUtils/viewUtils';
import { H2 } from 'govuk-react';

export function TwoAreasView({ areaCodes, indicatorsSelected }: IViewProps) {
  const chartList = getChartListForView(indicatorsSelected, 'twoAreasView');

  return (
    <>
      <H2>View data for both selected areas</H2>
      <p>
        fetch data for area {areaCodes.toString()}, indicator{' '}
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
