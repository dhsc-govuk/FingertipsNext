import { AreaDocument } from '@/lib/search/searchTypes';
import { Link } from 'govuk-react';
import styled from 'styled-components';

export interface SelectableAreaDocument extends AreaDocument {
  checked: boolean;
}

const StyleAreaFilterPanel = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: '19px',
});

interface AreaFilterPanelProps {
  areas: AreaDocument[];
  onOpen: () => void;
}

const getDisplayText = function (areaSize: number) {
  return areaSize > 0
    ? 'Open a filter to add or change areas'
    : 'Open area filter';
};

export const AreaFilterPanel = ({ areas, onOpen }: AreaFilterPanelProps) => {
  if (areas == null) return;

  return (
    <StyleAreaFilterPanel>
      <Link
        href="#"
        data-testid="search-form-link-filter-area"
        onClick={(e) => {
          e.preventDefault();
          if (onOpen != null) {
            onOpen();
          }
        }}
      >
        {getDisplayText(areas.length)}
      </Link>
    </StyleAreaFilterPanel>
  );
};
