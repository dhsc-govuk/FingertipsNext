'use client';

import { FC } from 'react';
import { Button } from 'govuk-react';
import { useShallowSearchParams } from '@/components/shallow/useShallowSearchParams';
import { AreaTypeSelect } from '@/components/shallow/AreaTypeSelect';
import { GroupTypeSelect } from '@/components/shallow/GroupTypeSelect';
import { GroupSelect } from '@/components/shallow/GroupSelect';
import { AreaCheckBoxes } from '@/components/shallow/AreaCheckBoxes';
import styled from 'styled-components';

const Div = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

// CLIENT SIDE RENDERED - AND - SERVER SIDE RENDERED
export const ShallowNavigation: FC = ({}) => {
  const { selectedAreaType, selectedGroupType, selectedGroup } =
    useShallowSearchParams();

  return (
    <form>
      <pre>
        {JSON.stringify(
          { selectedAreaType, selectedGroupType, selectedGroup },
          null,
          '  '
        )}
      </pre>
      <Div>
        <AreaTypeSelect />
        <GroupTypeSelect />
        <GroupSelect />
        <AreaCheckBoxes />
        <Button>Submit</Button>
      </Div>
    </form>
  );
};
