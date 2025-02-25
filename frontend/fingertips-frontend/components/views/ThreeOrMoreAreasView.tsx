import { H2 } from 'govuk-react';
import { IViewProps } from './OneAreaView';

export function ThreeOrMoreAreasView({
  areaCodes,
  indicatorsSelected,
}: IViewProps) {
  return (
    <>
      <H2>View data for all selected areas</H2>
      <p>
        fetch data for area {areaCodes.toString()}, indicator{' '}
        {indicatorsSelected.toString()}
      </p>
      <p>show the charts</p>
      {/* <ul>
        <li>Line Chart (if there is more than one year)</li>
        <li>Inequalities (bar and line)</li>
        <li>Population pyramid</li>
      </ul> */}
    </>
  );
}
