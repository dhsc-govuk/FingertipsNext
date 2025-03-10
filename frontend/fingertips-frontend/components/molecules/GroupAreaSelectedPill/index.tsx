'use client';

import { Pill } from '../Pill';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';

interface AreaSelectedPillProps {
  areaTypeName: string;
  groupSelected: AreaWithRelations;
  onRemoveFilter: (filterID: string) => void;
  inFilterPane?: boolean;
}

export const GroupAreaSelectedPill = ({
  areaTypeName,
  groupSelected,
  onRemoveFilter,
  inFilterPane,
}: Readonly<AreaSelectedPillProps>) => {
  return (
    <div style={{ display: 'inline' }}>
      <Pill
        removeFilter={onRemoveFilter}
        selectedFilterId={groupSelected.code}
        isFullWidth={inFilterPane}
      >
        <p style={{ margin: 0 }}>
          All {areaTypeName} in {groupSelected.name}, (
          {groupSelected.children?.length} areas)
        </p>
      </Pill>
    </div>
  );
};
