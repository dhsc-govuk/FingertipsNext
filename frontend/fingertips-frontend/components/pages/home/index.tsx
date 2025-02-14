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

export const Home = ({
  searchFormState,
}: {
  searchFormState: SearchFormState;
}) => {
  const [state, formAction] = useActionState(searchIndicator, searchFormState);

  return (
    <form action={formAction}>
      {state.message && (
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
        <SearchForm searchFormState={state}></SearchForm>
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
<<<<<<< HEAD
      <H6>What are indicators and profiles</H6>
      <div id="indicators">
        <Paragraph>
          Indicators use data to show us how things are going and if there are
          any changes over time. For example if the number of people smoking in
          South West England has gone up or down in the last ten years. These
          indicators can be used to compare public health by areas, and see how
          it is impacted by inequalities such as age, sex or ethnicity.
        </Paragraph>
      </div>
      <div id="profiles">
        <Paragraph>
          Indicators are used to create themed profiles that help build
          understanding of public health at a local, regional and national
          level. For example there will be multiple indicators for diabetes but
          a themed profile may combine other relevant indicators such as smoking
          or obesity to present a more rounded picture of the public health
          impact.
        </Paragraph>
      </div>
      <br />
      <H6>Who the service is for</H6>
=======
      <H3 id="whofor">Who the service is for</H3>
>>>>>>> main
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
