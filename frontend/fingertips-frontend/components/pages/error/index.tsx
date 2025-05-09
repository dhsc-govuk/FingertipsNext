'use client';

import { H1, Paragraph } from 'govuk-react';
import { useEffect } from 'react';
import { useSearchState } from '@/context/SearchStateContext';

interface ErrorPageProps{
    error?: string
}


export function ErrorPage({error}:ErrorPageProps) {
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState({});
  }, [setSearchState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <H1 data-testid="error-page-title">
        Sorry, there is a problem with the service
      </H1>
      <Paragraph>Try again later.</Paragraph>
      <Paragraph>
        You can [go back to the homepage](/) and start your search again.
      </Paragraph>
       <span style={{color:"red"}}>{error ?? ""}</span>
    </>
  );
}
