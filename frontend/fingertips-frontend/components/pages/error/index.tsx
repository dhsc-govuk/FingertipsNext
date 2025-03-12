'use client';

import { H1, Paragraph } from 'govuk-react';

export function ErrorPage() {
  return (
    <>
      <H1>Sorry, there is a problem with the service</H1>
      <Paragraph>Try again later.</Paragraph>
      <Paragraph>
        You can [go back to the homepage](/) and start your search again.
      </Paragraph>
    </>
  );
}
