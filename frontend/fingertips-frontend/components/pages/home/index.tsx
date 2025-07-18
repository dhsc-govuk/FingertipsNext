'use client';

import {
  ErrorSummary,
  H2,
  H3,
  InsetText,
  Link,
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { SearchForm } from '@/components/forms/SearchForm';
import {
  SearchFormState,
  searchIndicator,
} from '@/components/forms/SearchForm/searchActions';
import { useActionState, useEffect } from 'react';
import styled from 'styled-components';
import { spacing } from '@govuk-react/lib';
import { Area } from '@/generated-sources/ft-api-client';
import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { siteTitle } from '@/lib/constants';

export const ZeroMarginParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({ marginBottom: 0 })
);

interface HomeProps {
  areaFilterData?: AreaFilterData;
  selectedAreasData?: Area[];
  initialFormState: SearchFormState;
}
export const Home = ({
  areaFilterData,
  initialFormState,
  selectedAreasData,
}: HomeProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formState, setFormState] = useActionState(
    searchIndicator,
    initialFormState
  );

  return (
    <div>
      {formState.message && (
        <ErrorSummary
          errors={[
            {
              targetName: 'indicator',
              text: 'Enter a subject you want to search for',
            },
            {
              targetName: 'areaSearched',
              text: 'Enter an area you want to search for',
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
      <H2>{siteTitle}</H2>
      <Paragraph>
        This service provides easy access to a comprehensive collection of
        public health data for England. It can be used to monitor trends,
        identify inequalities, and make make data-driven decisions to improve
        public health.
      </Paragraph>

      <InsetText>This service was previously known as Fingertips</InsetText>

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

      <div id="search">
        <form action={setFormState}>
          <SearchForm
            formState={formState}
            selectedAreasData={selectedAreasData}
            areaFilterData={areaFilterData}
          />
        </form>
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
    </div>
  );
};
