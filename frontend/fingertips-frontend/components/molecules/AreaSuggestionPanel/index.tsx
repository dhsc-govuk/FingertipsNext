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
  padding: '0px',
  position: 'relative',
  width: '100% !important',
});

const AreaSuggestionPanelItem = styled(ListItem)({
  borderBottom: '0.6px solid #75738C',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row;',
  padding: '10px',
  margin: '0px !important',
  fontSize: '19px',
  weight: '300px',
});

const StyledSearchButton = styled(SearchBox.Button)({
  'backgroundColor': 'transparent',
  'alignSelf': 'center',
  'padding': '0px',
  'svg': {
    fill: '#75738C',
    width: '20px',
    height: '20px',
  },
  'outline': '0px',
  'border': 'none',
  '&:focus': {
    backgroundColor: 'transparent',
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
      {areas.map((area) => (
        <AreaSuggestionPanelItem
          key={`${area.areaCode}`}
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
              marginLeft: 'auto',
              minWidth: '150px',
              padding: '5px',
            }}
          >
            {area.areaType}
          </div>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
