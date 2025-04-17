import { useQuery } from '@tanstack/react-query';
import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';

export const useApiMapGeographyGet = (areaType?: AreaTypeKeysForMapMeta) => {
  const { mapFile } = areaType ? mapMetaDataEncoder[areaType] : {};

  return useQuery({
    queryKey: [mapFile],
    queryFn: () => fetch(`/maps/${mapFile}`).then((res) => res.json()),
    enabled: !!mapFile,
  });
};
