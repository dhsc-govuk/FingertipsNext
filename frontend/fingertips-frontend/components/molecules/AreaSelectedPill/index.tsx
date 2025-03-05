'use client';

import { Pill } from '../Pill';
import styled from 'styled-components';
import { formatAreaName } from '@/lib/areaFilterHelpers/formatAreaName';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

const StyleAreaName = styled('span')({
  fontWeight: '500',
});

const StyleAreaType = styled('span')({
  color: '#505A5F',
});

interface AreaSelectedPillProps {
  areaName: string;
  areaCode: string;
  areaTypeKey: AreaTypeKeys;
  areaTypeName: string;
  onRemoveFilter: (filterID: string) => void;
  inFilterPane?: boolean;
}

export const AreaSelectedPill = ({
  areaName,
  areaCode,
  areaTypeKey,
  areaTypeName,
  onRemoveFilter,
  inFilterPane,
}: Readonly<AreaSelectedPillProps>) => {
  return (
    <div style={{ display: 'inline' }}>
      <Pill
        removeFilter={onRemoveFilter}
        selectedFilterId={areaCode}
        isFullWidth={inFilterPane}
      >
        <p style={{ margin: 0 }}>
          <StyleAreaName>
            {formatAreaName(areaCode, areaName, areaTypeKey)}
          </StyleAreaName>{' '}
          <StyleAreaType>{areaTypeName}</StyleAreaType>
        </p>
      </Pill>
    </div>
  );
};
