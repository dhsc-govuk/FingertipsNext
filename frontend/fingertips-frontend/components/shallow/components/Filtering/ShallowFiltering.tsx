import { AreaTypeSelect } from '@/components/shallow/components/Filtering/AreaTypeSelect';
import { GroupTypeSelect } from '@/components/shallow/components/Filtering/GroupTypeSelect';
import { GroupSelect } from '@/components/shallow/components/Filtering/GroupSelect';
import { AreaCheckBoxes } from '@/components/shallow/components/Filtering/AreaCheckBoxes';
import { FC } from 'react';
import { SelectWrapper } from './Filtering.styles';
import {
  SidebarContent,
  SidebarDiv,
  SidebarHeader,
  SidebarTop,
} from '@/components/shallow/components/Sidebar/Sidebar.styles';

export const ShallowFiltering: FC = () => {
  return (
    <SidebarDiv>
      <SidebarTop>
        <SidebarHeader>Filters</SidebarHeader>
      </SidebarTop>
      <SidebarContent>
        <SelectWrapper>
          <AreaTypeSelect />
          <GroupTypeSelect />
          <GroupSelect />
        </SelectWrapper>
        <AreaCheckBoxes />
      </SidebarContent>
    </SidebarDiv>
  );
};
