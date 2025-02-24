import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { chartViewSelector } from '@/lib/chartHelpers/chartViewSelector';
import { H3 } from 'govuk-react';

export function ChartViewsSkeleton() {
  const chartViews = chartViewSelector();
  console.log(chartViews);
  return (
    <div>
      <H3>What chart views should we see?</H3>
      <ul>
        {Object.keys(chartViews).map((view) => {
          console.log(view, chartViews[view].toString());
          return (
            <li key={view}>
              {view}: {chartViews[view].toString()}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
