import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { FTHeader } from '@/components/molecules/Header';
import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import StyledComponentsRegistry from '@/lib/registry';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const gdsTransportFont = localFont({
  src: [
    {
      path: './fonts/GDSTransportBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/GDSTransportLight.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'FingertipsNext',
  description:
    'Fingertips is a rich source of indicators across a range of health and wellbeing themes designed to support JSNA and commissioning to improve health and wellbeing, and reduce inequalities.',
};

const mockMetaData = {
  indicatorID: '108',
  indicatorName: 'pancakes eaten',
  indicatorDefinition: 'number of pancakes consumed',
  dataSource: 'BJSS Leeds',
  earliestDataPeriod: '2025',
  latestDataPeriod: '2025',
  lastUpdatedDate: new Date('March 4, 2025'),
  unitLabel: 'pancakes',
  hasInequalities: true,
};

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['A001'];

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
  [SearchParams.AreasSelected]: mockAreas,
};

const testHealthData: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockHealthData['108'][0], mockHealthData['108'][1]],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={gdsTransportFont.className} style={{ margin: 0 }}>
        <StyledComponentsRegistry>
          <FTHeader />
          <FTContainer>
            <OneIndicatorOneAreaViewPlots
              indicatorData={testHealthData}
              searchState={searchState}
              indicatorMetadata={mockMetaData}
            />
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
