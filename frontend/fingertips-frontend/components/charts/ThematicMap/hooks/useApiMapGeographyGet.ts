import { useQuery } from '@tanstack/react-query';
import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/charts/ThematicMap/helpers/thematicMapHelpers';

export const useApiMapGeographyGet = (areaType?: AreaTypeKeysForMapMeta) => {
  const { mapFile } = areaType ? mapMetaDataEncoder[areaType] : {};

  return useQuery({
    queryKey: [`map-geo-json/${areaType}`],
    queryFn: () => fetch(`/maps/${mapFile}`).then((res) => res.json()),
    enabled: !!mapFile,
  });
};
