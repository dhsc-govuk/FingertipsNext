import { link, shape, spacing } from '@govuk-react/lib';
import NextLink from 'next/link';
import styled from 'styled-components';
import { SPACING_POINTS } from '@govuk-react/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import React from 'react';

const StyledBackLink = styled(NextLink)({
  ...link.common()[0],
  ...link.common()[1],
  ...link.styleText,
  ...{
    'display': 'inline-block',
    'position': 'relative',
    'marginTop': SPACING_POINTS[3],
    'marginBottom': SPACING_POINTS[3],
    'paddingLeft': '14px',
    'textDecoration': 'none',
    '&[href]': {
      borderBottom: `1px solid ${GovukColours.Black}`,
    },
    '::before': {
      ...shape.arrow({ direction: 'left', base: 10, height: 6 }),

      content: "''",
      position: 'absolute',
      top: '-1px',
      bottom: '1px',
      left: 0,
      margin: 'auto',
    },
  },
  ...spacing.withWhiteSpace(),
});

type BackLinkProps = {
  'href': string;
  'onClick'?: React.MouseEventHandler<HTMLAnchorElement>;
  'data-testid'?: string;
};

export const BackLink = (props: BackLinkProps) => {
  return (
    <StyledBackLink aria-label="Go back to the previous page" {...props}>
      Back
    </StyledBackLink>
  );
};
