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
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: searchFormState.indicator,
        }}
        hint={
          <div style={{ color: '#505a5f' }}>
            For example smoking, diabetes prevalence, or a specific indicator ID
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="indicator-search-form-input"
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
            For example district, county, region, NHS organisation or GP
            practice or code
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="search-form-input-area"
      >
        Search for an area
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
