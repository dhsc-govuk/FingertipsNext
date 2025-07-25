import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';

import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(areasSelected);

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    areaCodes?.length !== 1 ||
    areaCodes?.[0] !== areaCodeForEngland
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  if (
    !selectedIndicatorsData ||
    selectedIndicatorsData.length !== indicatorsSelected.length
  ) {
    throw new Error('invalid indicator metadata passed to view');
  }

  await connection();

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(
        indicator,
        [{ areaCodes: [areaCodeForEngland], areaType: englandAreaType.key }],
        BenchmarkReferenceType.England,
        true
      );
    })
  );

  return (
    <ViewsWrapper
      areaCodes={areaCodes}
      indicatorsDataForAreas={combinedIndicatorData}
    >
      <TwoOrMoreIndicatorsEnglandViewPlots
        indicatorData={combinedIndicatorData}
        indicatorMetadata={selectedIndicatorsData}
      />
    </ViewsWrapper>
  );
}
