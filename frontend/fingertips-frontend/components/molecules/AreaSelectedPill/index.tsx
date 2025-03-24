'use client';

import { Pill } from '../Pill';
import styled from 'styled-components';
import { formatAreaName } from '@/lib/areaFilterHelpers/formatAreaName';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleAreaName = styled('span')({
  fontWeight: '500',
  fontSize: '19px',
});

const StyleAreaType = styled('span')({
  color: GovukColours.DarkGrey,
});

interface AreaSelectedPillProps {
  area: AreaWithRelations;
  onRemoveFilter: (filterID: string) => void;
  isFullWidth?: boolean;
}

export const AreaSelectedPill = ({
  area,
  onRemoveFilter,
  isFullWidth,
}: Readonly<AreaSelectedPillProps>) => {
  return (
    <Pill
      removeFilter={onRemoveFilter}
      selectedFilterId={area.code}
      isFullWidth={isFullWidth}
      ariaLabelPostfix={area.name}
    >
      <p style={{ margin: 0 }}>
        <StyleAreaName>
          {formatAreaName(area.code, area.name, area.areaType.key)}
        </StyleAreaName>{' '}
        <StyleAreaType>{area.areaType.name}</StyleAreaType>
      </p>
    </Pill>
  );
};
