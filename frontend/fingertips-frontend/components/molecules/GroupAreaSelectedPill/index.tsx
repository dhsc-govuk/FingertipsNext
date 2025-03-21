'use client';

import styled from 'styled-components';
import { Pill } from '../Pill';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface GroupAreaSelectedPillProps {
  areaTypeName?: string;
  groupSelected?: AreaWithRelations;
  onRemoveFilter: () => void;
  isFullWidth?: boolean;
}

const StyleAreaType = styled('span')({
  color: GovukColours.DarkGrey,
});

export const GroupAreaSelectedPill = ({
  areaTypeName,
  groupSelected,
  onRemoveFilter,
  isFullWidth,
}: Readonly<GroupAreaSelectedPillProps>) => {
  return (
    <Pill
      removeFilter={onRemoveFilter}
      selectedFilterId={groupSelected?.code}
      isFullWidth={isFullWidth}
      ariaLabelPostfix={groupSelected?.name}
    >
      <p style={{ margin: 0 }}>
        All areas in {groupSelected?.name}{' '}
        <StyleAreaType>{areaTypeName}</StyleAreaType>
      </p>
    </Pill>
  );
};
