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

  // If true the pill should only allow the data to be viewed, and have no
  // behaviour that can cause the UI to be changed.
  isViewOnly?: boolean;
}

const StyleAreaType = styled('span')({
  color: GovukColours.DarkGrey,
});

export const GroupAreaSelectedPill = ({
  areaTypeName,
  groupSelected,
  onRemoveFilter,
  isFullWidth,
  isViewOnly,
}: Readonly<GroupAreaSelectedPillProps>) => {
  return (
    <Pill
      removeFilter={onRemoveFilter}
      selectedFilterId={groupSelected?.code}
      isFullWidth={isFullWidth}
      ariaLabelPostfix={groupSelected?.name}
      isViewOnly={isViewOnly}
    >
      <p style={{ margin: 0 }}>
        All areas in {groupSelected?.name}{' '}
        <StyleAreaType>{areaTypeName}</StyleAreaType>
      </p>
    </Pill>
  );
};
