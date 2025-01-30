import { Button, InputField } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './searchActions';

// TODO JH - investigate a way to use govuk-colours
// they compile, but TS doesn't import them in a nice way - govuk-react does the same thing but suppresses the errors.
const govukBlack = '#0b0c0c';
const govukLightGrey = '#f3f2f1';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const IndicatorSearchForm = ({
  searchFormState,
}: {
  searchFormState: IndicatorSearchFormState;
}) => {
  return (
    <div data-testid="indicator-search-form">
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
        Search By Subject
      </StyledInputField>
      <Button type="submit" data-testid="search-form-button-submit">
        Search
      </Button>
      <Button
        type="reset"
        buttonColour={govukLightGrey}
        buttonTextColour={govukBlack}
      >
        Reset Search
      </Button>
    </div>
  );
};
