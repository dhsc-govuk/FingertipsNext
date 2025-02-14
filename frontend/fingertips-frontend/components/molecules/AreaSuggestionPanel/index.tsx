/*
 A component that hold the area suggestion list
*/
import { ListItem, SearchBox, UnorderedList } from 'govuk-react';
import styled from 'styled-components';
import { AreaDocument, AREA_TYPE_GP } from '@/lib/search/searchTypes';

function formatAreaName(area: AreaDocument): string {
  return area.areaType === AREA_TYPE_GP
    ? `${area.areaCode} - ${area.areaName}`
    : area.areaName;
}

const StyleSearchSuggestionPanel = styled(UnorderedList)({
  display: 'flex',
  flexDirection: 'column',
  padding: '0px !important',
  width: '100% !important',
});

const AreaSuggestionPanelItem = styled(ListItem)({
  borderBottom: '1px solid #75738C',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row;',
  padding: '10px 1px 10px 1px',
  margin: '0px !important',
  fontSize: '19px',
  fontWeight: '300px',
});

const StyledSearchButton = styled(SearchBox.Button)({
  'backgroundColor': 'transparent !important',
  'padding': '0px !important',
  'svg': {
    fill: '#75738C',
    width: '20px',
    height: '20px',
  },
  '&:focus': {
    backgroundColor: 'transparent !important',
    outline: '0px',
  },
});

interface AreaSuggestionPanelProps {
  areas: AreaDocument[];
  onItemSelected: (area: AreaDocument) => void;
}

export const AreaSuggestionPanel = ({
  areas,
  onItemSelected,
}: AreaSuggestionPanelProps) => {
  if (areas.length == 0) {
    return;
  }
  return (
    <StyleSearchSuggestionPanel>
      {areas.map((area, key) => (
        <AreaSuggestionPanelItem
          key={`suggestion_panel_item_${key}_${area.areaCode}`}
          onClick={() => {
            onItemSelected(area);
          }}
        >
          <StyledSearchButton />
          <div style={{ flexGrow: '3', padding: '5px' }}>
            {formatAreaName(area)}
          </div>
          <div
            style={{
              backgroundColor: '#E1E2E3',
              margin: 'auto',
              padding: '5px 8px 4px 8px',
              fontSize: '16px',
              textAlign: 'right',
              fontWeight: '300px',
            }}
          >
            {area.areaType}
          </div>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
