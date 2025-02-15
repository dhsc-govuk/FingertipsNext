import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { UnorderedList, ListItem } from 'govuk-react';
import { StyleSearchHeader } from '../AreaSearchInputField';
import { Pill } from '../Pill';
import { memo } from 'react';

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

const AreaSelectionSearchPillPanelHeader = styled(StyleSearchHeader)({
  marginTop: '10px',
  marginBottom: '5px;',
});

const StyleAreaPill = styled(Pill)({
  backgroundColor: '#000000',
});

interface AreaSelectionSearchPillPanelProps {
  areas: AreaDocument[];
  onRemovePill: (area: AreaDocument) => void;
}
export const AreaSelectionSearchPillPanel = memo(
  ({
    areas,
    onRemovePill: onRemoveFilterPill,
  }: AreaSelectionSearchPillPanelProps) => {
    if (areas.length == 0) return null;
    return (
      <div>
        <AreaSelectionSearchPillPanelHeader>
          Selected areas (<span style={{ margin: '0px' }}>{areas.length}</span>)
        </AreaSelectionSearchPillPanelHeader>

        <StyleAreaSearchSelectionPanel>
          {' '}
          {areas.map((area: AreaDocument) => (
            <StyleAreaSearchSelectionPanelItem
              key={'selection-panel-area-' + area.areaCode}
            >
              <StyleAreaPill
                removeFilter={(_: string) => {
                  if (onRemoveFilterPill != null) {
                    onRemovePill(area);
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
  }
);
// This is the keep lints quiet
AreaSelectionSearchPillPanel.displayName = 'AreaSelectionSearchPillPanel';
