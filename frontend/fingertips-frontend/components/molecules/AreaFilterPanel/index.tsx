import { Link } from 'govuk-react';
import styled from 'styled-components';

const StyleAreaFilterPanel = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: '19px',
});

interface AreaFilterPanelProps {
  areas: string[] | undefined;
}

const getDisplayText = function (areas: string[] | undefined) {
  return areas && areas.length > 0
    ? 'Open a filter to add or change areas'
    : 'Open area filter';
};

export const AreaAutoCompleteFilterPanel = ({
  areas,
}: AreaFilterPanelProps) => {
  return (
    <StyleAreaFilterPanel>
      <Link
        href="#"
        data-testid="search-form-link-filter-area"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {getDisplayText(areas)}
      </Link>
    </StyleAreaFilterPanel>
  );
};
