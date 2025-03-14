import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { FTHeader } from '@/components/molecules/Header';
import { PyramidPopulationChartView } from '@/components/viewPlots/PyramidPopulationChartView';
import StyledComponentsRegistry from '@/lib/registry';
import type { Metadata } from 'next';
import { mockHealthData } from '@/mock/data/healthdata';

export const metadata: Metadata = {
  title: 'FingertipsNext',
  description:
    'Fingertips is a rich source of indicators across a range of health and wellbeing themes designed to support JSNA and commissioning to improve health and wellbeing, and reduce inequalities.',
};

const benchmarkEnglandData = mockHealthData['337'][0];
const selectedData = mockHealthData['337'][1];

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

            <PyramidPopulationChartView
              populationHealthDataForAreas={mockHealthData['337']}
              selectedAreaCode={selectedData.areaCode}
              xAxisTitle="Age"
              yAxisTitle="Percentage"
            />
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
