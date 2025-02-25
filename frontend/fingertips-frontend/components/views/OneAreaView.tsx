import { H2 } from 'govuk-react';

export interface IViewProps {
  areaCodes: string[];
  indicatorsSelected: string[];
}

export function OneAreaView({ areaCodes, indicatorsSelected }: IViewProps) {
  return (
    <>
      <p>Backlink?</p>
      <H2>View data for the selected area</H2>
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
