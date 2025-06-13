import { FC } from 'react';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { useApiHealthDataForAnIndicatorGet } from '@/components/shallow/hooks/useApiHealthDataForAnIndicatorGet';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '@/components/viewPlots/OneIndicatorTwoOrMoreAreasViewPlots';
import { HealthDataForAnIndicatorUrlOptions } from '@/components/shallow/apiUrls';

export const ShallowViews: FC = () => {
  const { areasSelected, areaTypeSelected } = useShallowSearchParams();

  const selectedAreasWithEngland = [
    ...new Set([...areasSelected, areaCodeForEngland]),
  ];

  const indicatorParams: HealthDataForAnIndicatorUrlOptions = {
    areaCodes: selectedAreasWithEngland,
    areaType: areaTypeSelected,
  };

  if (areasSelected.length >= 2) {
    indicatorParams.includeEmptyAreas = true;
    indicatorParams.latestOnly = areasSelected.length > 2;
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

  if (!healthData) return <div>Loading...</div>;

  if (areasSelected.length >= 2) {
    return <OneIndicatorTwoOrMoreAreasViewPlots indicatorData={healthData} />;
  }

  return <OneIndicatorOneAreaViewPlots indicatorData={healthData} />;
};
