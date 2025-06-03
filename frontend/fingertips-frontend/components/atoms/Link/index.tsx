import { link } from '@govuk-react/lib';
import NextLink from 'next/link';
import styled from 'styled-components';

export const Link = styled(NextLink)({
  ...link.common()[0],
  ...link.common()[1],
  ...link.styleDefault,
  ...link.printFriendly,
});
