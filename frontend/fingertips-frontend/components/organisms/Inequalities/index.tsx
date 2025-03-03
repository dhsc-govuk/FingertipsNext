import { InequalitiesTable } from '@/components/molecules/Inequalities/Table';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React from 'react';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
}

export function Inequalities({
  healthIndicatorData,
}: Readonly<InequalitiesProps>) {
  return (
    <div data-testid="inequalities-component">
      <InequalitiesTable healthIndicatorData={healthIndicatorData} />
    </div>
  );
}
