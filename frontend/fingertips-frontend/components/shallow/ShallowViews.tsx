import { FC } from 'react';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { useApiHealthDataForAnIndicatorGet } from '@/components/shallow/hooks/useApiHealthDataForAnIndicatorGet';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';

export const ShallowViews: FC = () => {
  const { selectedAreas, selectedAreaType, selectedGroup } =
    useShallowSearchParams();

  const { healthData } = useApiHealthDataForAnIndicatorGet(41101, {
    areaCodes: selectedAreas,
    areaType: selectedAreaType,
    inequalities: [
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
    ],
  });

  if (!healthData) return <div>Loading...</div>;

  // return <pre>{JSON.stringify(healthData, null, '  ')}</pre>;
  return (
    <OneIndicatorOneAreaViewPlots
      searchState={{ gs: selectedGroup, as: selectedAreas }}
      indicatorData={healthData}
    />
  );
};
