import { FTContainer } from '@/components/layouts/container';
import StyledComponentsRegistry from '@/lib/registry';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../global.css';
import { siteDescription, siteTitle } from '@/lib/constants';
import { HeaderFooterWrapper } from '@/components/molecules/HeaderFooterWrapper';
import { auth } from '@/lib/auth';
import { LoaderProvider } from '@/context/LoaderContext';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  // vars read SSR and passed down to the footer component
  const tag = process.env.NEXT_PUBLIC_FINGERTIPS_GIT_TAG;
  const hash = process.env.NEXT_PUBLIC_FINGERTIPS_GIT_HASH;

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <StyledComponentsRegistry>
          <LoaderProvider>
            <HeaderFooterWrapper
              tag={tag}
              hash={hash}
              session={session ?? undefined}
            >
              <FTContainer>{children}</FTContainer>
            </HeaderFooterWrapper>
          </LoaderProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
