'use client';

import { H1, Link, Paragraph } from 'govuk-react';

type ErrorPageProps = {
  errorText: string;
  errorLink: string;
  errorLinkText: string;
};

export function ErrorPage({
  errorText,
  errorLink,
  errorLinkText,
}: Readonly<ErrorPageProps>) {
  return (
    <>
      <H1>An error has occurred.</H1>
      <Paragraph data-testid="error-page-text">{`${errorText}`}</Paragraph>
      <Link data-testid="error-page-link" href={`${errorLink}`}>
        {`${errorLinkText}`}
      </Link>
    </>
  );
}
