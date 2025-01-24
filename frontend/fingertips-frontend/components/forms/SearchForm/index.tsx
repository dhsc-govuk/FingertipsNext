'use client';

import { SearchFormState, getSearchSuggestions } from './searchActions';
import {
  InsetText,
  Button,
  InputField,
  Paragraph,
  H3,
  Link,
} from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const SearchForm = ({
  searchFormState,
}: {
  searchFormState: SearchFormState;
}) => {
  return (
    <div
      data-testid="search-form"
      style={{ backgroundColor: '#f3f2f1', padding: '20px 20px 0px 20px' }}
    >
      <H3>Find public health data</H3>
      <Paragraph>
        Search for data to compare at local, regional and national levels.
      </Paragraph>
      <InsetText>
        Use both search options to help you find the most accurate data
        available.
      </InsetText>
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: searchFormState.indicator,
        }}
        hint={
          <div style={{ color: '#505a5f' }}>
            For example diabetes, public health indicator, or indicator ID
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="search-form-input-indicator"
      >
        Search by subject
      </StyledInputField>
      <StyledInputField
        style={{ marginBottom: '5px' }}
        input={{
          id: 'areaSearched',
          name: 'areaSearched',
          defaultValue: searchFormState.areaSearched,
          onChange: async (e) => {
            console.log(await getSearchSuggestions(e.target.value));
          },
        }}
        hint={
          <div style={{ color: '#505a5f' }}>
            For example postcode, county, local authority, NHS Trust or General
            Practice name or code
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="search-form-input-area"
      >
        Search for an area by location or organisation
      </StyledInputField>
      <Link href="#" data-testid="search-form-link-filter-area">
        Or filter by area
      </Link>
      <br />
      <Button
        type="submit"
        data-testid="search-form-button-submit"
        style={{ marginTop: '25px' }}
      >
        Search
      </Button>
    </div>
  );
};
