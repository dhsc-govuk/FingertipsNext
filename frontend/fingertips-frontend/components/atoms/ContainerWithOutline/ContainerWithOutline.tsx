import styled from 'styled-components';
import { BorderColour } from '@/lib/styleHelpers/colours';

export const ContainerWithOutline = styled.div`
  @media (min-width: 641px) {
    border: 1px solid ${BorderColour};
    padding: 30px 20px 5px 20px;
  }
`;
