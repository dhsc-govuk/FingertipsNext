'use client';

import { searchIndicator, SearchFormState } from './searchActions';
import {
  ErrorSummary,
  InsetText,
  Button,
  InputField,
  Paragraph,
  H3,
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
          onHandleErrorClick={(targetName: string) => {
            const indicator = document.getElementById(targetName);
            indicator?.scrollIntoView(true);
            indicator?.focus();
          }}
        />
      )}
      <br />
      <div
        data-testid="search-form"
        style={{ backgroundColor: '#ddd', padding: '20px 20px 0px 20px' }}
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
            defaultValue: state.indicator ?? searchFormState.indicator,
          }}
          hint={
            <div style={{ color: 'black' }}>
              For example diabetes, public health indicator, or indicator ID
            </div>
          }
          meta={{
            touched: !!state.message,
            error: 'This field value may be required',
          }}
          data-testid="search-form-input-indicator"
        >
          Search by subject
        </StyledInputField>
        <>
          <StyledInputField
            style={{ marginBottom: '0' }}
            input={{
              id: 'indicator',
              name: 'indicator',
              defaultValue: state.indicator ?? searchFormState.indicator,
            }}
            hint={
              <div style={{ color: 'black' }}>
                For example postcode, county, local authority, NHS Trust or
                General Practice name or code
              </div>
            }
            meta={{
              touched: !!state.message,
              error: 'This field value may be required',
            }}
            data-testid="search-form-input-area"
          >
            Search for an area by location or organisation
          </StyledInputField>
          <p
            style={{
              textDecoration: 'underline',
              margin: '8px 0px 0px',
              fontSize: '18px',
            }}
          >
            Or filter by area
          </p>
        </>
        <br />
        <Button type="submit" data-testid="search-form-button-submit">
          Search
        </Button>
      </div>
    </form>
  );
};
