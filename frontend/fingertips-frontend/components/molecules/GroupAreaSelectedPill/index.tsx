'use client';

import styled from 'styled-components';
import { Pill } from '../Pill';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';

interface GroupAreaSelectedPillProps {
  areaTypeName?: string;
  groupSelected?: AreaWithRelations;
  onRemoveFilter: () => void;
  inFilterPane?: boolean;
}

const StyleAreaType = styled('span')({
  color: '#505A5F',
});

export const GroupAreaSelectedPill = ({
  areaTypeName,
  groupSelected,
  onRemoveFilter,
  inFilterPane,
}: Readonly<GroupAreaSelectedPillProps>) => {
  return (
    <Pill
      removeFilter={onRemoveFilter}
      selectedFilterId={groupSelected?.code}
      isFullWidth={inFilterPane}
    >
      <p style={{ margin: 0 }}>
        All areas in {groupSelected?.name}{' '}
        <StyleAreaType>{areaTypeName}</StyleAreaType>
      </p>
    </Pill>
  );
};
