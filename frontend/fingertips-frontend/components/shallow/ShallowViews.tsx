import { FC } from 'react';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { useApiHealthDataForAnIndicatorGet } from '@/components/shallow/hooks/useApiHealthDataForAnIndicatorGet';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { HealthDataForAnIndicatorUrlOptions } from '@/components/shallow/apiUrls';

export const ShallowViews: FC = () => {
  const { selectedAreas, selectedAreaType, selectedGroup } =
    useShallowSearchParams();

  const selectedAreasWithEngland = [
    ...new Set([...selectedAreas, areaCodeForEngland]),
  ];

  const indicatorParams: HealthDataForAnIndicatorUrlOptions = {
    areaCodes: selectedAreasWithEngland,
    areaType: selectedAreaType,
  };

  if (selectedAreas.length >= 2) {
    indicatorParams.includeEmptyAreas = true;
    indicatorParams.latestOnly = selectedAreas.length > 2;
  } else {
    indicatorParams.inequalities = [
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
    ];
  }

  const { healthData } = useApiHealthDataForAnIndicatorGet(
    41101,
    indicatorParams
  );

  const searchState = { gs: selectedGroup, as: selectedAreas };

  if (!healthData) return <div>Loading...</div>;

  if (selectedAreas.length >= 2) {
    return (
      <OneIndicatorTwoOrMoreAreasViewPlots
        searchState={searchState}
        indicatorData={healthData}
      />
    );
  }

  return (
    <OneIndicatorOneAreaViewPlots
      searchState={searchState}
      indicatorData={healthData}
    />
  );
};
