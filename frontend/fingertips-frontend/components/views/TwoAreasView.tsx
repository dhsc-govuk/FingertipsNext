import { IViewProps } from '@/lib/viewUtils';
import { H2 } from 'govuk-react';

export function TwoAreasView({ areaCodes, indicatorsSelected }: IViewProps) {
  return (
    <>
      <H2>View data for both selected areas</H2>
      <p>
        fetch data for area {areaCodes.toString()}, indicator{' '}
        {indicatorsSelected.toString()}
      </p>
      <p>show the charts</p>
    </>
  );
}
