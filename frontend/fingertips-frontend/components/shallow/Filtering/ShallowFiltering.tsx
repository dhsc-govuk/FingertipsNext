import {
  DivFlexColumn,
  DivSelects,
} from '@/components/shallow/ShallowNavigationStyles';
import { AreaTypeSelect } from '@/components/shallow/Filtering/AreaTypeSelect';
import { GroupTypeSelect } from '@/components/shallow/Filtering/GroupTypeSelect';
import { GroupSelect } from '@/components/shallow/Filtering/GroupSelect';
import { AreaCheckBoxes } from '@/components/shallow/Filtering/AreaCheckBoxes';
import { FC } from 'react';

export const ShallowFiltering: FC = () => {
  return (
    <DivFlexColumn>
      <DivSelects>
        <AreaTypeSelect />
        <GroupTypeSelect />
        <GroupSelect />
      </DivSelects>
      <AreaCheckBoxes />
    </DivFlexColumn>
  );
};
