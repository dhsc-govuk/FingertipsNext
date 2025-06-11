import styled from 'styled-components';
import { TagColours } from '@/lib/styleHelpers/colours';
import { H3 } from 'govuk-react';

export const SidebarDiv = styled.div({
  backgroundColor: TagColours.GreyBackground,
  width: '300px',
  boxSizing: 'border-box',
});

export const SidebarTop = styled('div')({
  backgroundColor: '#D1D2D3',
  display: 'flex',
  padding: '8px 16px',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SidebarHeader = styled(H3)({ marginBottom: 0 });

export const SidebarContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px',
  gap: '16px',
});
