'use client'; // Error boundaries must be Client Components

import StyledComponentsRegistry from '@/lib/registry';
import { FTHeader } from '@/components/molecules/Header';
import { FTContainer } from '@/components/layouts/container';
import { FTFooter } from '@/components/molecules/Footer';
import { H1, Paragraph } from 'govuk-react';

// next.js will only use this page in production builds, meaning that
// in dev builds you will see the developer oriented unhandled exception
// page that is useful for debugging
//
export default function GlobalError() {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <FTHeader />
          <FTContainer>
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
