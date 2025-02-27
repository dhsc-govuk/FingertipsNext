import { ListItem, UnorderedList, SearchIcon } from 'govuk-react';
import styled from 'styled-components';
import { AreaDocument, formatAreaName } from '@/lib/search/searchTypes';

const StyleSearchSuggestionPanel = styled(UnorderedList)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 0px;
  margin-right: 0px;
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

const StyleHighLightedText = styled('span')({
  fontWeight: '600',
});

const highlightText = (text: string, searchHint: string) => {
  const parts = text.split(new RegExp(`(${searchHint})`, 'gi'));
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchHint.toLowerCase()) {
      return (
        <StyleHighLightedText key={'highlight_' + index}>
          {part}
        </StyleHighLightedText>
      );
    }
    return part;
  });
};

interface AreaAutoCompleteSuggestionPanelProps {
  areas: AreaDocument[];
  onItemSelected: (area: AreaDocument) => void;
  searchHint: string;
}

export const AreaAutoCompleteSuggestionPanel = ({
  areas,
  onItemSelected,
  searchHint,
}: AreaAutoCompleteSuggestionPanelProps) => {
  if (areas.length === 0) return null;

  return (
    <StyleSearchSuggestionPanel>
      {areas.map((area) => (
        <AreaSuggestionPanelItem
          key={area.areaCode}
          onClick={() => onItemSelected(area)}
        >
          <SearchIcon
            width="15px"
            height="15px"
            fill="#75738c"
            style={{ padding: '0px', margin: 'auto 10px auto auto' }}
          />
          <div style={{ flexGrow: 3, padding: '5px' }}>
            {highlightText(formatAreaName(area), searchHint)}
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
