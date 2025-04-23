'use client'; // Error boundaries must be Client Components

import { H1, Paragraph } from 'govuk-react';

export default function NotFoundPage() {
  return (
    <>
      <H1 data-testid="error-page-title">Page not found</H1>
      <Paragraph>If you typed the web address, check it is correct.</Paragraph>
      <Paragraph>
        If you pasted the web address, check you copied the entire address.
      </Paragraph>
    </>
  );
}
