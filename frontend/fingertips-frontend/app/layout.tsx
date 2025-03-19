import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { FTHeader } from '@/components/molecules/Header';
import StyledComponentsRegistry from '@/lib/registry';
import type { Metadata } from 'next';
import FocusOnFragment from '@/components/focusOnFragment';

export const metadata: Metadata = {
  title: 'FingertipsNext',
  description:
    'Fingertips is a rich source of indicators across a range of health and wellbeing themes designed to support JSNA and commissioning to improve health and wellbeing, and reduce inequalities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FocusOnFragment />
        <StyledComponentsRegistry>
          <FTHeader />
          <FTContainer>{children}</FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
