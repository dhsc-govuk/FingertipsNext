import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { Link } from 'govuk-react';

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
      <p>
        Map source:{' '}
        <Link href={`${mapMetaDataEncoder[areaType].mapSoureURL}`}>
          {mapMetaDataEncoder[areaType].mapSource}
        </Link>
        <br />
        {mapMetaDataEncoder[areaType].mapCopyright}
      </p>
      {dataSource ? <p>Data source: {dataSource}</p> : null}
    </div>
  );
}
