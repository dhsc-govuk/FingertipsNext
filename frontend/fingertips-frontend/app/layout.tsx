import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { FTHeader } from '@/components/molecules/Header';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import StyledComponentsRegistry from '@/lib/registry';
import { mockHealthData } from '@/mock/data/healthdata';
import type { Metadata } from 'next';

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
        <StyledComponentsRegistry>
          <FTHeader />
          <FTContainer>
            <PopulationPyramidWithTable
              healthDataForAreas={mockHealthData['337']}
              groupAreaSelected={mockHealthData['337'][1].areaCode}
              xAxisTitle="Age"
              yAxisTitle="Percentage of population"
              searchState={{}}
            />
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
