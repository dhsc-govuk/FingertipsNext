'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

const isBrowser = () => typeof window !== 'undefined';

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
    return <>{styles}</>;
  });

  if (isBrowser()) {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <>{children}</>
    </StyleSheetManager>
  );
}
