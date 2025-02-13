import { AreaDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { UnorderedList, ListItem, Label } from 'govuk-react';
import { StyleSearchHeader } from '../AreaSearchInputField';

const StyleAreaSearchSelectionPanel = styled(UnorderedList)({
  display: 'flex',
  flexDirection: 'column-reserve',
  padding: '10px',
  margin: '0px',
  backgroundColor: '#FFFFFF !important',
  overFlow: 'hidden',
});

const StyleAreaSearchSelectionPanelItem = styled(ListItem)({
  display: 'flex',
  position: 'relative',
  padding: '5px',
  margin: '0px',
  border: '1px solid #B2B4B6',
  overflow: 'clip',
  flexDirection: 'row',
  borderRadius: '5px',
  float: 'left',
  whiteSpace: 'normal;',
  backgroundColor: '#F3F2F1',
});

const StyleSelectedCloseButtonLabel = styled(Label)({
  margin: 'auto',
  width: '30px',
  borderRadius: '5px',
  cursor: 'pointer',
  color: '#0B0C0C',
  weight: '300',
  fontSize: '12px',
  textAlign: 'center !important',
  clear: 'both',
});

interface AreaSearchSelectionPanelProps {
  areas: AreaDocument[];
  onClick: (area: AreaDocument) => void;
}
export const AreaSearchSelectionPanel = ({
  areas,
  onClick,
}: AreaSearchSelectionPanelProps) => {
  return (
    <div>
      <StyleSearchHeader>Selected areas({areas.length})</StyleSearchHeader>

      <StyleAreaSearchSelectionPanel>
        {' '}
        {areas.map((area: AreaDocument) => (
          <StyleAreaSearchSelectionPanelItem key={area.areaCode}>
            <StyleSelectedCloseButtonLabel
              onClick={(e) => {
                e.preventDefault();
                if (onClick != null) {
                  onClick(area);
                }
              }}
            >
              {' '}
              X{' '}
            </StyleSelectedCloseButtonLabel>
            <div style={{ flexGrow: '3', padding: '5px' }}>
              <span>
                {area.areaCode}-{area.areaName}
              </span>
              <span>{area.areaType}</span>
            </div>
          </StyleAreaSearchSelectionPanelItem>
        ))}
      </StyleAreaSearchSelectionPanel>
    </div>
  );
};
