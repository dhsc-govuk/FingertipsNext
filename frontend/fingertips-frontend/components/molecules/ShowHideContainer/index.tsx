'use client';

import { Details } from 'govuk-react';
import { SyntheticEvent } from 'react';
import styled from 'styled-components';

interface ShowHideContainerProps {
  summary: string;
  showSideBarWhenOpen?: boolean;
  open?: boolean;
  children: React.ReactNode;
  onToggleContainer: () => void;
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
  onToggleContainer,
}: Readonly<ShowHideContainerProps>) {
  return (
    <StyledFilterDetails
      data-testid="select-areas-filter-panel-label"
      summary={summary}
      showSideBar={showSideBarWhenOpen}
      open={open}
      onClick={(e: SyntheticEvent) => {
        // The following is to prevent the onClickFunction being called when a child event in triggered
        // @ts-expect-error for child event there will be a target type of checkbox or select-one
        const targetType = e.target.type ?? 'unknown';

        if (targetType === 'unknown') {
          onToggleContainer();
        }
      }}
    >
      {children}
    </StyledFilterDetails>
  );
}
