'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const isBrowser = () => typeof window !== 'undefined';

const GlobalStyle = createGlobalStyle`
  body * {
    font-family: 'gdsTransportFont', arial, sans-serif !important;
  }
`;

export default function StyledComponentsRegistry({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is the recommended approach for getting Styled components to be rendered server side
  // https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return (
      <>
        <GlobalStyle />
        {styles}
      </>
    );
  });

  if (isBrowser()) {
    return (
      <>
        <GlobalStyle />
        {children}
      </>
    );
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <>
        <GlobalStyle />
        {children}
      </>
    </StyleSheetManager>
  );
}
