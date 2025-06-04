import {
  AreaTypeKeysForMapMeta,
  mapMetaDataEncoder,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { ExcludeFromExport } from '@/components/molecules/Export/exportHelpers';

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
        <StyledCredits
          className={ExcludeFromExport}
        >{`Data source: ${dataSource}`}</StyledCredits>
      ) : null}
    </div>
  );
}
