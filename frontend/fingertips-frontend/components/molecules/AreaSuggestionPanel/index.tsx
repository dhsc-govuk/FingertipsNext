import { ListItem, UnorderedList } from 'govuk-react';
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

const SearchIcon = () => {
  return (
    <svg
      viewBox="0 0 57 57"
      width="15"
      height="15"
      fill="#75738c"
      style={{ padding: '0px', margin: 'auto 10px auto auto' }}
    >
      <path
        d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,
    23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,
    1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,
    17 s-17-7.626-17-17S14.61,6,23.984,6z"
      />
    </svg>
  );
};

const StyleHighLightedText = styled('span')({
  fontWeight: '600',
});

const highlightText = (text: string, searchHint: string) => {
  const parts = text.split(new RegExp(`(${searchHint})`, 'gi'));
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchHint.toLowerCase()) {
      return <StyleHighLightedText key={index}>{part}</StyleHighLightedText>;
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
          <SearchIcon />
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
