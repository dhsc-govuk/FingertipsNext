'use client';

import { searchIndicator, SearchFormState } from './searchActions';
import {
  H1,
  ErrorSummary,
  LeadParagraph,
  InsetText,
  Button,
  InputField,
} from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import { useActionState } from 'react';
import styled from 'styled-components';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const SearchForm = ({
  searchFormState,
}: {
  searchFormState: SearchFormState;
}) => {
  const [state, formAction] = useActionState(searchIndicator, searchFormState);

  return (
    <main>
      <form action={formAction}>
        {state.message && (
          <ErrorSummary
            description="At least one of the following fields must be populated:"
            errors={[
              {
                targetName: 'indicator',
                text: 'Indicator field',
              },
            ]}
            data-testid="search-form-error-summary"
          />
        )}
        <H1>Find public health data</H1>
        <LeadParagraph>
          Find public health data by subjects, and health or local authority
          areas.
        </LeadParagraph>
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
            <>
              For example diabetes, public health indicator, or indicator ID241
            </>
          }
          data-testid="search-form-input-indicator"
        >
          Search by subject
        </StyledInputField>

        <Button type="submit" data-testid="search-form-button-submit">
          Search
        </Button>
      </form>
    </main>
  );
};
