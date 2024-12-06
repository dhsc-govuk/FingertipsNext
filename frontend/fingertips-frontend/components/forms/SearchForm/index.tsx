'use client';

import { searchIndicator, SearchFormState } from './searchActions';
import { H1, Button, InputField } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import { useActionState } from 'react';
import styled from 'styled-components';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const SearchForm = ({ indicator }: { indicator: string }) => {
  const initialState: SearchFormState = {
    indicator: '',
    message: null,
    errors: {},
  };
  const [_state, formAction] = useActionState(searchIndicator, initialState);

  return (
    <>
      <H1>Search</H1>
      <form action={formAction}>
        <StyledInputField
          input={{
            id: 'indicator',
            name: 'indicator',
            defaultValue: indicator,
          }}
          hint={<>Type in here the IndicatorId.</>}
          data-testid="input-indicator-search"
        >
          Indicator id or keyword
        </StyledInputField>

        <Button type="submit">Search</Button>
      </form>
    </>
  );
};
