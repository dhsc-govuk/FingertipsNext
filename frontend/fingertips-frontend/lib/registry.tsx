'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

const shouldForwardProp = (propName: string, target: unknown) => {
  return typeof target === 'string' ? isPropValid(propName) : true;
};

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

  if (typeof window !== 'undefined') {
    return (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        {children}
      </StyleSheetManager>
    );
  }

  return (
    <StyleSheetManager
      sheet={styledComponentsStyleSheet.instance}
      shouldForwardProp={shouldForwardProp}
    >
      {children}
    </StyleSheetManager>
  );
}
