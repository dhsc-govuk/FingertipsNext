'use client';

import { FC } from 'react';
import { Button } from 'govuk-react';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { AreaTypeSelect } from '@/components/shallow/AreaTypeSelect';
import { GroupTypeSelect } from '@/components/shallow/GroupTypeSelect';
import { GroupSelect } from '@/components/shallow/GroupSelect';
import { AreaCheckBoxes } from '@/components/shallow/AreaCheckBoxes';
import { ShallowViews } from '@/components/shallow/ShallowViews';
import {
  DivFlexColumn,
  DivFlexRow,
  DivSelects,
} from '@/components/shallow/ShallowNavigationStyles';

// CLIENT SIDE RENDERED - AND - SERVER SIDE RENDERED
export const ShallowNavigation: FC = ({}) => {
  const { selectedAreaType, selectedGroupType, selectedGroup } =
    useShallowSearchParams();

  const showViews = true;

  return (
    <form>
      <pre>
        {JSON.stringify(
          { selectedAreaType, selectedGroupType, selectedGroup },
          null,
          '  '
        )}
      </pre>
      <DivFlexRow>
        <DivFlexColumn>
          <DivSelects>
            <AreaTypeSelect />
            <GroupTypeSelect />
            <GroupSelect />
          </DivSelects>
          <AreaCheckBoxes />
        </DivFlexColumn>
        <div>
          <Button>Submit</Button>
          {showViews ? <ShallowViews /> : null}
        </div>
      </DivFlexRow>
    </form>
  );
};
