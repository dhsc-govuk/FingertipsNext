import { FTContainer } from '@/components/layouts/container';
import StyledComponentsRegistry from '@/lib/registry';
import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import '../global.css';
import { HeaderFooterWrapper } from '@/components/molecules/HeaderFooterWrapper';
import { siteDescription, siteTitle } from '@/lib/constants';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // vars read SSR and passed down to the footer component
  const tag = process.env.NEXT_PUBLIC_FINGERTIPS_GIT_TAG;
  const hash = process.env.NEXT_PUBLIC_FINGERTIPS_GIT_HASH;

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Suspense>
          <StyledComponentsRegistry>
            <HeaderFooterWrapper tag={tag} hash={hash}>
              <FTContainer>{children}</FTContainer>
            </HeaderFooterWrapper>
          </StyledComponentsRegistry>
        </Suspense>
      </body>
    </html>
  );
}
