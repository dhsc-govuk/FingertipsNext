import { useApiMapGeographyGet } from '@/components/charts/ThematicMap/hooks/useApiMapGeographyGet';
import {
  AreaTypeKeysForMapMeta,
  getMapGeographyData,
} from '@/components/charts/ThematicMap/helpers/thematicMapHelpers';
import { useMemo } from 'react';

export const useMapGeographyData = (
  areaCodes: string[],
  areaType?: AreaTypeKeysForMapMeta
) => {
  const { data, isLoading, error } = useApiMapGeographyGet(areaType);

  const mapGeographyData = useMemo(() => {
    if (!areaType || !data) return;
    return getMapGeographyData(areaType, areaCodes, data);
  }, [areaType, data, areaCodes]);

  return { isLoading, error, mapGeographyData };
};
