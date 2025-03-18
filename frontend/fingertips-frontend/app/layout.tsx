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
const groupAreaForHealth = mockHealthData['337'][2];

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
              healthDataForAreas={[mockHealthData['337'][1]]}
              xAxisTitle="Age"
              yAxisTitle="Percentage"
              currentDate={new Date(Date.now())}
            />
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
