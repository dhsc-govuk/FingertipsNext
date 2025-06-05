import { format } from 'date-fns';
import styled from 'styled-components';

const copyrightDateFormat = 'd MMMM yyyy';

const StyledDiv = styled.div({
  fontSize: '14px',
  marginBottom: '8px',
});

export const exportCopyrightText = () => {
  const now = new Date();
  const year = now.getFullYear();
  return `©Crown copyright ${year}. Office for Health Improvement & Disparities.`;
};

export const exportAccessedDate = () => {
  const now = new Date();
  const accessedDate = format(now, copyrightDateFormat);
  return `Public Health Profiles accessed on ${accessedDate} www.fingertips.phe.org.uk`;
};

export const ExportCopyright = () => {
  return (
    <StyledDiv>
      {exportCopyrightText()}
      <br />
      {exportAccessedDate()}
    </StyledDiv>
  );
};
