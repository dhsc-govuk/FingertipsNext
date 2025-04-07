import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';

interface ThematicMapCreditsProps {
  areaType: AreaTypeKeysForMapMeta;
  dataSource?: string;
}

export function ThematicMapCredits({
  areaType,
  dataSource,
}: ThematicMapCreditsProps) {
  return (
    <div
      data-testid="thematic-map-credits"
      style={{ whiteSpace: 'preserve-breaks' }}
    >
      <p>Map source: {mapMetaDataEncoder[areaType].mapSource}</p>
      {dataSource ? <p>Data source: {dataSource}</p> : null}
    </div>
  );
}
