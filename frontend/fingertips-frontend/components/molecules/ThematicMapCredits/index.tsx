import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { Paragraph } from 'govuk-react';
import styled from 'styled-components';

interface ThematicMapCreditsProps {
  areaType: AreaTypeKeysForMapMeta;
  dataSource?: string;
}

const StyledCredits = styled(Paragraph)`
  font-size: 16px;
`;

export function ThematicMapCredits({
  areaType,
  dataSource,
}: Readonly<ThematicMapCreditsProps>) {
  return (
    <div
      data-testid="thematic-map-credits"
      style={{ whiteSpace: 'preserve-breaks' }}
    >
      <StyledCredits>{`Map source: [${mapMetaDataEncoder[areaType].mapSource}](${mapMetaDataEncoder[areaType].mapSourceURL})<br />
        ${mapMetaDataEncoder[areaType].mapCopyright}`}</StyledCredits>
      {dataSource ? (
        <StyledCredits>{`Data source: ${dataSource}`}</StyledCredits>
      ) : null}
    </div>
  );
}
