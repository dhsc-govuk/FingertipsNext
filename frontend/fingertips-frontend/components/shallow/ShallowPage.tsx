'use client';

import { FC } from 'react';
import { Button } from 'govuk-react';
import { ShallowViews } from '@/components/shallow/ShallowViews';
import {
  DivContent,
  DivFlexRow,
} from '@/components/shallow/ShallowNavigationStyles';
import { ServerSideOnly } from '@/components/shallow/ServerSideOnly';
import { ShallowFiltering } from '@/components/shallow/Filtering/ShallowFiltering';

// CLIENT SIDE RENDERED - AND - SERVER SIDE RENDERED
export const ShallowPage: FC = () => {
  return (
    <form>
      <DivFlexRow>
        <DivContent>
          <ShallowFiltering />
          <ServerSideOnly>
            <Button>Submit</Button>
          </ServerSideOnly>
          <ShallowViews />
        </DivContent>
      </DivFlexRow>
    </form>
  );
};
