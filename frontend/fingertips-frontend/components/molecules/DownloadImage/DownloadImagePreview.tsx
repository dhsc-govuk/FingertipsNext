import styled from 'styled-components';
import { SyntheticEvent, useRef } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';

const Preview = styled.div({
  display: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: `rgba(255, 255, 255, 0.75)`,
  zIndex: 1000,
});

const Content = styled.div({
  position: 'absolute',
  top: '50vh',
  left: '50vw',
  backgroundColor: GovukColours.LightGrey,
  padding: '32px',
  border: `1px solid ${GovukColours.Black}`,
});

const Links = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

export const DownloadImagePreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    ref.current.style.display = 'none';
  };
  return (
    <Preview ref={ref} id={'DownloadImagePreview'}>
      <Content id={'DownloadImagePreview-content'}>
        <div id={'DownloadImagePreview-canvas'} onClick={onClick}></div>
        <Links>
          <a id={'DownloadImagePreview-link'} href={'#'}>
            Download
          </a>
          <a href={'#'} onClick={onClick}>
            Close
          </a>
        </Links>
      </Content>
    </Preview>
  );
};
