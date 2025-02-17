import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { UnorderedList, ListItem } from 'govuk-react';
import { Pill } from '../Pill';
import { memo } from 'react';

const StyleAreaSearchSelectionPanel = styled(UnorderedList)({
  display: 'flex',
  flexDirection: 'column-reserve',
  padding: '0px',
  margin: '0px',
  overFlow: 'hidden',
});

const StyleAreaAutoCompletePillPanelItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'row',
});

const StyleAreaAutoCompletePillPanelHeader = styled('span')({
  display: 'inline-block',
  marginTop: '10px',
  fontFamily: 'Arial',
  marginBottom: '5px;',
  fontWeight: '400',
  fontSize: '19px',
  lineHeight: '1.415;',
});

interface AreaAutoCompletePillPanelProps {
  areas: AreaDocument[];
  onRemovePill: (area: AreaDocument) => void;
}
export const AreaAutoCompletePillPanel = memo(
  ({ areas, onRemovePill }: AreaAutoCompletePillPanelProps) => {
    if (areas.length == 0) return null;
    return (
      <div>
        <StyleAreaAutoCompletePillPanelHeader>
          Selected areas ({areas.length})
        </StyleAreaAutoCompletePillPanelHeader>

        <StyleAreaSearchSelectionPanel>
          {' '}
          {areas.map((area: AreaDocument) => (
            <StyleAreaAutoCompletePillPanelItem
              key={'selection-panel-area-' + area.areaCode}
            >
              <Pill
                removeFilter={(_: string) => {
                  if (onRemovePill != null) {
                    onRemovePill(area);
                  }
                }}
                selectedFilterId={'pill_' + area.areaCode + area.areaName}
                selectedFilterName={area.areaName + '-' + area.areaCode}
              />
            </StyleAreaAutoCompletePillPanelItem>
          ))}
        </StyleAreaSearchSelectionPanel>
      </div>
    );
  }
);
// This is the keep lints quiet
AreaAutoCompletePillPanel.displayName = 'AreaSelectionSearchPillPanel';
