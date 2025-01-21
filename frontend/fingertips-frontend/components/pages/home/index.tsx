'use client';

import {
  ErrorSummary,
  H3,
  H6,
  LeadParagraph,
  ListItem,
  Paragraph,
  UnorderedList,
} from 'govuk-react';
import { SearchForm } from '@/components/forms/SearchForm';
import {
  SearchFormState,
  searchIndicator,
} from '@/components/forms/SearchForm/searchActions';
import { useActionState } from 'react';

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
            const indicator = document.getElementById(targetName);
            indicator?.scrollIntoView(true);
            indicator?.focus();
          }}
        />
      )}
      <H3>Access public health data</H3>
      <LeadParagraph>
        This is a free government service providing access to a wide range of
        public health data in England.
      </LeadParagraph>
      <H6>You can use this service to:</H6>
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
        All data comes from trusted sources such as the NHS and Office of
        National Statistics (ONS). It is analysed to create a wide range of
        health and wellbeing data sets known as [indicators](#indicators), and
        themed topics known as [profiles](#profiles).
      </Paragraph>
      <SearchForm searchFormState={state}></SearchForm>
      <br />
      <br />
      <H6>What are indicators and profiles</H6>
      <div id="indicators">
        <Paragraph>
          Indicators use data to show us how things are going and if there are
          any changes over time. For example if the number of people smoking in
          South West England has gone up or down in the last ten years. These
          indicators can be used to compare public heath by areas, and see how
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
      <Paragraph>
        The service is free and available to everyone. Its primary role is to
        supports health professionals, policymakers, and researchers to monitor
        health trends, identify inequalities, and make informed decisions about
        public health in England.
      </Paragraph>
      <br />
    </form>
  );
};
