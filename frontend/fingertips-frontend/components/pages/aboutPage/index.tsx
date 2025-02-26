'use client';

import { AreaType } from '@/generated-sources/ft-api-client';
import { H2, Paragraph } from 'govuk-react';

export const AboutPage = ({ areaTypes }: { areaTypes: AreaType[] }) => {
  return (
    <div>
      <H2>ABOUT PAGE</H2>
      {areaTypes.map((areaType) => (
        <Paragraph key={areaType.key}>{areaType.name}</Paragraph>
      ))}
    </div>
  );
};
