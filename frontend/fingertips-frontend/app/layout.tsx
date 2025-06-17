import { FTContainer } from '@/components/layouts/container';
import StyledComponentsRegistry from '@/lib/registry';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../global.css';
import { HeaderFooterWrapper } from '@/components/molecules/HeaderFooterWrapper';
import { auth } from '@/lib/authService/auth';

export const metadata: Metadata = {
  title: 'FingertipsNext',
  description:
    'Fingertips is a rich source of indicators across a range of health and wellbeing themes designed to support JSNA and commissioning to improve health and wellbeing, and reduce inequalities.',
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
          <HeaderFooterWrapper
            tag={tag}
            hash={hash}
            session={session ?? undefined}
          >
            <FTContainer>{children}</FTContainer>
          </HeaderFooterWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
