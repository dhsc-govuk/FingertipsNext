'use client';

import { Details } from 'govuk-react';
import styled from 'styled-components';

interface ShowHideContainerProps {
  summary: string;
  showSideBarWhenOpen?: boolean;
  children: React.ReactNode;
}

const StyledFilterDetails = styled(Details)<{ showSideBar: boolean }>(
  {
    div: {
      padding: '1em 0em',
    },
    summary: {
      color: '#000000',
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
  children,
}: Readonly<ShowHideContainerProps>) {
  return (
    <StyledFilterDetails summary={summary} showSideBar={showSideBarWhenOpen}>
      {children}
    </StyledFilterDetails>
  );
}
