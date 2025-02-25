import { H2 } from 'govuk-react';
import { IViewProps } from './OneAreaView';

export function TwoAreasView({ areaCodes, indicatorsSelected }: IViewProps) {
  return (
    <>
      <H2>View data for both selected areas</H2>
      <p>
        fetch data for area {areaCodes.toString()}, indicator{' '}
        {indicatorsSelected.toString()}
      </p>
      <p>show the charts</p>
      {/* <ul>
        <li>Line Chart (if there is more than one year)</li>
        <li>Bar Chart </li>
        <li>Population pyramid</li>
      </ul> */}
    </>
  );
}
