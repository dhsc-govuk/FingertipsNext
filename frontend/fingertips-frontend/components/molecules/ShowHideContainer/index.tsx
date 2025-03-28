'use client';

import { Details } from 'govuk-react';
import styled from 'styled-components';

interface ShowHideContainerProps {
  summary: string;
  showSideBarWhenOpen?: boolean;
  open?: boolean;
  children: React.ReactNode;
}

const StyledFilterDetails = styled(Details)<{ showSideBar: boolean }>(
  {
    div: {
      padding: '0.5em 0em',
    },
    summary: {
      'color': '#000000',
      ':hover': {
        color: '#000000',
      },
    },
  },
  ({ showSideBar }) => {
    if (showSideBar) {
      return {
        div: {
          borderLeft: '5px #A1A2A3 solid',
          paddingLeft: '1em',
        },
      };
    }
    return {
      div: {
        borderLeft: 'none',
      },
    };
  }
);

export function ShowHideContainer({
  summary,
  showSideBarWhenOpen = false,
  open = true,
  children,
}: Readonly<ShowHideContainerProps>) {
  return (
    <StyledFilterDetails
      key={`select-areas-filter-panel-label-${open}`}
      data-testid="select-areas-filter-panel-label"
      summary={summary}
      showSideBar={showSideBarWhenOpen}
      open={open}
    >
      {children}
    </StyledFilterDetails>
  );
}
