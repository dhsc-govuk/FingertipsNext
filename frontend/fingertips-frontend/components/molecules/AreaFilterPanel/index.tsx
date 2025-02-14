import { AreaDocument } from '@/lib/search/searchTypes';
import { Checkbox, Link, ListItem, UnorderedList } from 'govuk-react';
import styled from 'styled-components';

export interface SelectableAreaDocument extends AreaDocument {
  checked: boolean;
}

const StyleAreaFilterPanel = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: '19px',
});

const StyleAreaFilterPanelItemsPanel = styled(UnorderedList)({});

const StyleAreaFilterPanelItem = styled(ListItem)({});

interface AreaFilterPanelProps {
  areas: AreaDocument[];
  onOpen: () => void;
}

const getDisplayText = function (areaSize: number) {
  console.log('ARea = ', areaSize);
  return areaSize <= 0
    ? 'Open a filter to add or change areas'
    : 'Open area filter';
};

export const AreaFilterPanel = ({ areas, onOpen }: AreaFilterPanelProps) => {
  if (areas == null) return;

  return (
    <StyleAreaFilterPanel>
      <Link
        href="#"
        data-testid="search-form-link-filter-area"
        onClick={(e) => {
          e.preventDefault();
          if (onOpen != null) {
            onOpen();
          }
        }}
      >
        {getDisplayText(areas.length)}
      </Link>

      {/* { (areas.length > 0) && (
                <StyleAreaFilterPanelItemsPanel>
                    {
                        areas.map((area)=>(
                            <StyleAreaFilterPanelItem key='filter-{{area.areaCode}}' >
                            <Checkbox checked></Checkbox>
                               <div>
                                    {area.areaName}
                               </div>
                               <div>
                                   {area.areaType}
                               </div>
                            </StyleAreaFilterPanelItem>
                        ))
                    }
                </StyleAreaFilterPanelItemsPanel>
             )} */}
    </StyleAreaFilterPanel>
  );
};
