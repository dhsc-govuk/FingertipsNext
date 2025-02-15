'use client';

import { SearchFormState } from './searchActions';
import { Button, InputField, H3 } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import AreaAutoCompleteSearchPanel from '@/components/molecules/AreaAutoCompleteSearchPanel';
import { AreaDocument } from '@/lib/search/searchTypes';

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
          <div style={{ color: GovukColours.DarkGrey }}>
            For example, smoking, diabetes prevalence, or a specific indicator
            ID
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

      <AreaAutoCompleteSearchPanel
        onAreaSelected={(area: AreaDocument) => {
          searchFormState.areaSearched = area.areaName;
        }}
        inputFieldErrorStatus={!!searchFormState.message}
        defaultValue={searchFormState.areaSearched ?? ''}
      />

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
