import { ListItem, SearchBox, UnorderedList } from 'govuk-react';
import styled from 'styled-components';
import { AreaDocument } from '@/lib/search/searchTypes';

function formatAreaName(area: AreaDocument): string {
  return area.areaType === 'GP'
    ? `${area.areaCode} - ${area.areaName}`
    : area.areaName;
}

const StyleSearchSuggestionPanel = styled(UnorderedList)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 13px;
  margin-right: 15px;
`;

const AreaSuggestionPanelItem = styled(ListItem)`
  border-bottom: 1px solid #75738c;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  padding: 10px 1px;
  margin: 0;
  font-size: 19px;
  font-weight: 300;
`;

const StyledSearchButton = styled(SearchBox.Button)`
  background-color: transparent;
  padding: 0;
  svg {
    fill: #75738c;
    width: 20px;
    height: 20px;
  }
  &:focus {
    background-color: transparent;
    outline: none;
  }
`;

interface AreaAutoCompleteSuggestionPanelProps {
  areas: AreaDocument[];
  onItemSelected: (area: AreaDocument) => void;
}

export const AreaAutoCompleteSuggestionPanel = ({
  areas,
  onItemSelected,
}: AreaAutoCompleteSuggestionPanelProps) => {
  if (areas.length === 0) return null;

  return (
    <StyleSearchSuggestionPanel>
      {areas.map((area) => (
        <AreaSuggestionPanelItem
          key={area.areaCode}
          onClick={() => onItemSelected(area)}
        >
          <StyledSearchButton />
          <div style={{ flexGrow: 3, padding: '5px' }}>
            {formatAreaName(area)}
          </div>
          <div
            style={{
              backgroundColor: '#E1E2E3',
              margin: 'auto',
              padding: '5px 8px 4px 8px',
              fontSize: '16px',
              textAlign: 'right',
              fontWeight: '300',
            }}
          >
            {area.areaType}
          </div>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
