'use client';

import { Pill } from '../Pill';
import styled from 'styled-components';
import { formatAreaName } from '@/lib/areaFilterHelpers/formatAreaName';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleAreaName = styled('span')({
  fontWeight: '500',
});

const StyleAreaType = styled('span')({
  color: GovukColours.DarkGrey,
});

interface AreaSelectedPillProps {
  area: AreaWithRelations;
  onRemoveFilter: (filterID: string) => void;
  inFilterPane?: boolean;
}

export const AreaSelectedPill = ({
  area,
  onRemoveFilter,
  inFilterPane,
}: Readonly<AreaSelectedPillProps>) => {
  return (
    <Pill
      removeFilter={onRemoveFilter}
      selectedFilterId={area.code}
      isFullWidth={inFilterPane}
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
