import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { H3 } from 'govuk-react';

export function Inequalities() {
  return (
    <div data-testid="inequalities-component">
      <H3>Related inequalities data</H3>
      <ArrowExpander
        openTitle="Show inequalities data"
        closeTitle="Hide inequalities data"
      >
        <InequalitiesBarChartAndTable />
        <InequalitiesTrendChartAndTable />
      </ArrowExpander>
    </div>
  );
}
