import { H2 } from 'govuk-react';
import {
  chartOptions,
  getChartListForView,
  IViewProps,
} from '@/lib/viewUtils/viewUtils';

export function OneAreaView({ areaCodes, indicatorsSelected }: IViewProps) {
  // based on the number of indicators
  // determine the visalisations to show
  const chartList = getChartListForView(indicatorsSelected, 'oneAreaView');
  // determine the data to fetch

  return (
    <>
      <p>Backlink? maybe on layout</p>
      <H2>View data for the selected area</H2>
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
