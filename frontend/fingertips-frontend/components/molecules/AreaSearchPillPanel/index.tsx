import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { UnorderedList, ListItem } from 'govuk-react';
import { StyleSearchHeader } from '../AreaSearchInputField';
import { Pill } from '../Pill';

const StyleAreaSearchSelectionPanel = styled(UnorderedList)({
  display: 'flex',
  flexDirection: 'column-reserve',
  padding: '0px',
  margin: '0px',
  overFlow: 'hidden',
});

const StyleAreaSearchSelectionPanelItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'row',
});

const StyleAreaSearchPillHeader = styled(StyleSearchHeader)({
  marginTop: '10px',
  marginBottom: '5px;',
});

const StyleAreaPill = styled(Pill)({
  backgroundColor: '#000000',
});

interface AreaSearchPillPanelProps {
  areas: AreaDocument[];
  onClick: (area: AreaDocument) => void;
}
export const AreaSearchPillPanel = ({
  areas,
  onClick,
}: AreaSearchPillPanelProps) => {
  if (areas.length == 0) return null;
  return (
    <div>
      <StyleAreaSearchPillHeader>
        Selected areas (<span style={{ margin: '0px' }}>{areas.length}</span>)
      </StyleAreaSearchPillHeader>

      <StyleAreaSearchSelectionPanel>
        {' '}
        {areas.map((area: AreaDocument) => (
          <StyleAreaSearchSelectionPanelItem
            key={'selection-panel-area-' + area.areaCode}
          >
            <StyleAreaPill
              removeFilter={(_: string) => {
                if (onClick != null) {
                  onClick(area);
                }
              }}
              selectedFilterId={'pill_' + area.areaCode + area.areaName}
              selectedFilterName={area.areaName + '-' + area.areaCode}
            />
          </StyleAreaSearchSelectionPanelItem>
        ))}
      </StyleAreaSearchSelectionPanel>
    </div>
  );
};
