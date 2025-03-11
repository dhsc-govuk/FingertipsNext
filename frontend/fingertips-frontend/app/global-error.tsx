'use client'; // Error boundaries must be Client Components

import StyledComponentsRegistry from '@/lib/registry';
import { FTHeader } from '@/components/molecules/Header';
import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { H1, Paragraph } from 'govuk-react';

export default function GlobalError() {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <FTHeader />
          <FTContainer>
            <h3>Generic error</h3>
            <H1>Sorry, there is a problem with the service</H1>
            <Paragraph>Try again later.</Paragraph>
            <Paragraph>
              You can [go back to the homepage](/) and start your search again.
            </Paragraph>
          </FTContainer>
          <FTFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
