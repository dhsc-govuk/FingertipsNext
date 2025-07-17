import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';

export function Inequalities() {
  return (
    <div data-testid="inequalities-component">
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
