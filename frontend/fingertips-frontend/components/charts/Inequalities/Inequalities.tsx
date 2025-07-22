import { InequalitiesBarChartAndTable } from '@/components/charts/Inequalities/InequalitiesBarChartAndTable/InequalitiesBarChartAndTable';
import { InequalitiesTrendChartAndTable } from '@/components/charts/Inequalities/InequalitiesTrendChartAndTable/InequalitiesTrendChartAndTable';

export function Inequalities() {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesBarChartAndTable />
      <InequalitiesTrendChartAndTable />
    </div>
  );
}
