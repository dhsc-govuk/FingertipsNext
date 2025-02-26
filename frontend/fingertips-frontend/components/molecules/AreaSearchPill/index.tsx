'use client';

import { Pill } from '../Pill';
import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';

const StyleAreaName = styled('span')({
  paddingRight: '5px',
});

interface AreaSearchPillProps {
  area: AreaDocument;
  onRemoveFilter: (filterID: string) => void;
}

export const AreaSearchPill = ({
  area,
  onRemoveFilter,
}: Readonly<AreaSearchPillProps>) => {
  return (
    <Pill removeFilter={onRemoveFilter} selectedFilterId={area.areaCode}>
      <div
        style={{
          padding: '5px 10px 5px 10px',
          display: 'flex',
          fontWeight: 300,
        }}
      >
        <StyleAreaName>{area.areaName}</StyleAreaName>
        <span style={{ color: '#505A5F', paddingTop: '1px' }}>
          {area.areaType}
        </span>
      </div>
    </Pill>
  );
};
