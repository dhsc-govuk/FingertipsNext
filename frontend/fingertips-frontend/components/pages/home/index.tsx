'use client';

import {
  ErrorSummary,
  H2,
  H3,
  Link,
  ListItem,
  Paragraph,
  UnorderedList,
  SectionBreak,
} from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';
import { SearchForm } from '@/components/forms/SearchForm';
import {
  SearchFormState,
  searchIndicator,
} from '@/components/forms/SearchForm/searchActions';
import { useActionState } from 'react';
import styled from 'styled-components';
import { spacing } from '@govuk-react/lib';

const ZeroMarginParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({ marginBottom: 0 })
);

interface HomeProps {
  searchState?: SearchStateParams;
  initialFormState: SearchFormState;
}
export const Home = ({ searchState, initialFormState }: HomeProps) => {
  const [formState, setFormState] = useActionState(
    searchIndicator,
    initialFormState
  );

  return (
    <form action={setFormState}>
      {formState.message && (
        <ErrorSummary
          description="At least one of the following fields must be populated:"
          errors={[
            {
              targetName: 'indicator',
              text: 'Search subject',
            },
            {
              targetName: 'areaSearched',
              text: 'Search area',
            },
          ]}
          data-testid="search-form-error-summary"
          onHandleErrorClick={(targetName: string) => {
            const targetElement = document.getElementById(targetName);
            targetElement?.scrollIntoView(true);
            targetElement?.focus();
          }}
        />
      )}
      <H2>Access public health data</H2>
      <Paragraph>
        A free government service that provides access to a wide range of public
        health data in England.
      </Paragraph>
      <br />

      <ZeroMarginParagraph>Contents</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        <ListItem>
          <Link href="#search">Find public health data</Link>
        </ListItem>
        <ListItem>
          <Link href="#whatfor">What the service is for</Link>
        </ListItem>
        <ListItem>
          <Link href="#indicators">About indicators</Link>
        </ListItem>
        <ListItem>
          <Link href="#whofor">Who the service is for</Link>
        </ListItem>
      </UnorderedList>
      <br />
      <div id="search">
        <SearchForm searchState={searchState} formState={formState} />
      </div>
      <SectionBreak level="LARGE" visible />
      <H3 id="whatfor">What the service is for</H3>
      <Paragraph>You can use this service to:</Paragraph>
      <UnorderedList>
        <ListItem>
          Identify and compare health trends and inequalities using data
          visualisations
        </ListItem>
        <ListItem>Download datasets and visualisations</ListItem>
        <ListItem>
          Access raw data via an application programming interface (API)
        </ListItem>
      </UnorderedList>
      <Paragraph>
        This data comes from trusted sources such as the NHS and Office of
        National Statistics (ONS). It is analysed to create a wide range of
        health and wellbeing data sets known as indicators, and themed topics
        known as profiles.
      </Paragraph>
      <br />
      <H3 id="indicators">About indicators</H3>
      <Paragraph>
        Indicators use data to show us how things are going and if there are any
        changes over time. For example, if the number of people smoking in South
        West England has gone up or down in the last ten years. These indicators
        can be used to compare public heath by areas, and see how it is impacted
        by inequalities such as age, sex or ethnicity.
      </Paragraph>
      <br />
      <H3 id="whofor">Who the service is for</H3>
      <Paragraph>
        The service is free and available to everyone. Its primary role is to
        support health professionals, policymakers, and researchers to monitor
        health trends, identify inequalities, and make informed decisions about
        public health in England.
      </Paragraph>
      <br />
    </form>
  );
};
