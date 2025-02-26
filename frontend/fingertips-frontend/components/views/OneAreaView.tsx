import { H2 } from 'govuk-react';
import { chartOptions, IViewProps } from '@/lib/viewUtils';

export function OneAreaView({ areaCodes, indicatorsSelected }: IViewProps) {
  // based on the number of indicators
  // determine the visalisations to show
  // determine the data to fetch
  const chartList: chartOptions[] = ['populationPyramid'];
  if (indicatorsSelected.length === 1) {
    chartList.push('lineChart', 'barChart', 'inequalities');
  } else {
    chartList.push('spineChart');
  }

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
        {chartList.map((chart) => (
          <li key={chart}>{chart}</li>
        ))}
      </ul>
    </>
  );
}
