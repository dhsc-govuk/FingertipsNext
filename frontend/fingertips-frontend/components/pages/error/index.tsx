'use client';

import { H1, Paragraph } from 'govuk-react';
import { useEffect } from 'react';

export interface ErrorPageProps {
  title?: string;
  description?: string;
}

const genericErrorPageTitle = 'Sorry, there is a problem with the service';
const genericErrorPageMessage = 'Try again later.';

export function ErrorPage({
  title = genericErrorPageTitle,
  description = genericErrorPageMessage,
}: Readonly<ErrorPageProps>) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <H1 data-testid="error-page-title">{title}</H1>
      <Paragraph>{description}</Paragraph>
      <Paragraph>
        You can [go back to the homepage](/) and start your search again.
      </Paragraph>
    </>
  );
}
