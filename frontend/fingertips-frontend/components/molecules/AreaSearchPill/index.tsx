'use client';

import { Pill } from '../Pill';
import { AreaDocument, formatAreaName } from '@/lib/search/searchTypes';
import styled from 'styled-components';
const StyleAreaName = styled('span')({
  paddingRight: '5px',
});

const StylePillWrapper = styled('div')({
  padding: '5px 10px 5px 10px',
  display: 'flex',
  fontWeight: 300,
});

const StylePillSpan = styled('span')({
  color: '#505A5F',
  paddingTop: '1px',
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
      <StylePillWrapper>
        <StyleAreaName>{formatAreaName(area)}</StyleAreaName>
        <StylePillSpan>{area.areaType}</StylePillSpan>
      </StylePillWrapper>
    </Pill>
  );
};
