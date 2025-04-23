import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { Paragraph } from 'govuk-react';

interface ThematicMapCreditsProps {
  areaType: AreaTypeKeysForMapMeta;
  dataSource?: string;
}

export function ThematicMapCredits({
  areaType,
  dataSource,
}: Readonly<ThematicMapCreditsProps>) {
  return (
    <div
      data-testid="thematic-map-credits"
      style={{ whiteSpace: 'preserve-breaks' }}
    >
      <Paragraph>{`Map source: [${mapMetaDataEncoder[areaType].mapSource}](${mapMetaDataEncoder[areaType].mapSourceURL})<br />
        ${mapMetaDataEncoder[areaType].mapCopyright}`}</Paragraph>
      {dataSource ? (
        <Paragraph>{`Data source: ${dataSource}`}</Paragraph>
      ) : null}
    </div>
  );
}
