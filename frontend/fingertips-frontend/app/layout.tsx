import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { FTHeader } from '@/components/molecules/Header';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import StyledComponentsRegistry from '@/lib/registry';
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
            {/* {children} */}
            <PopulationPyramid
              healthIndicatorData={{
                dataForSelectedArea: {
                  ageCategories: [
                    '0 to 10',
                    '11 to 30',
                    '31  to 40',
                    '41 to 75',
                  ],
                  femaleSeries: [89, 10, 10, 92, 50],
                  maleSeries: [19, 20, 40, 22, 11, 50],
                },
              }}
              xAxisTitle="Ages"
              yAxisTitle="Percentage"
            />
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
