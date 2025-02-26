import { AreaDocument } from '@/lib/search/searchTypes';
import { Link } from 'govuk-react';
import styled from 'styled-components';

const StyleAreaFilterPanel = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: '19px',
});

interface AreaFilterPanelProps {
  areas: AreaDocument[];
}

const getDisplayText = function (areaSize: number) {
  return areaSize > 0
    ? 'Open a filter to add or change areas'
    : 'Open area filter';
};

export const AreaAutoCompleteFilterPanel = ({
  areas,
}: AreaFilterPanelProps) => {
  if (areas == null) return;

  return (
    <StyleAreaFilterPanel>
      <Link
        href="#"
        data-testid="search-form-link-filter-area"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {getDisplayText(areas.length)}
      </Link>
    </StyleAreaFilterPanel>
  );
};
