import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { UnorderedList, ListItem} from 'govuk-react';
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

const AreaSelectionSearchPillPanelHeader = styled('span')({
  display:"inline-block",
  marginTop: '10px',
  fontFamily:"Arial",
  marginBottom: '5px;',
  fontWeight:"400",
  fontSize: '19px',
  lineHeight: "1.415;",
});


interface AreaSelectionSearchPillPanelProps {
  areas: AreaDocument[];
  onRemovePill: (area: AreaDocument) => void;
}
export const AreaSelectionSearchPillPanel = memo(
  ({ areas, onRemovePill }: AreaSelectionSearchPillPanelProps) => {
    if (areas.length == 0) return null;
    return (
      <div>
        <AreaSelectionSearchPillPanelHeader>
          Selected areas ({areas.length})
        </AreaSelectionSearchPillPanelHeader>

        <StyleAreaSearchSelectionPanel>
          {' '}
          {areas.map((area: AreaDocument) => (
            <StyleAreaSearchSelectionPanelItem
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
            </StyleAreaSearchSelectionPanelItem>
          ))}
        </StyleAreaSearchSelectionPanel>
      </div>
    );
  }
);
// This is the keep lints quiet
AreaSelectionSearchPillPanel.displayName = 'AreaSelectionSearchPillPanel';
