import { IViewProps } from '@/lib/viewUtils';
import { H2 } from 'govuk-react';

export function EnglandView({ areaCodes, indicatorsSelected }: IViewProps) {
  return (
    <>
      <p>Backlink?</p>
      <H2>View data for England</H2>
      <p>
        fetch data for area {areaCodes.toString()} and indicator{' '}
        {indicatorsSelected.toString()}
      </p>
      <p>show the charts</p>
    </>
  );
}
