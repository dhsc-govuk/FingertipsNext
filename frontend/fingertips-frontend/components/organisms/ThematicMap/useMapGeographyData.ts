import { useApiMapGeographyGet } from '@/components/organisms/ThematicMap/useApiMapGeographyGet';
import {
  AreaTypeKeysForMapMeta,
  getMapGeographyData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
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
