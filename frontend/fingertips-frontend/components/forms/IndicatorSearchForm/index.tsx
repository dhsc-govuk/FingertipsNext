import { ErrorText, FormGroup, SearchBox } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './searchActions';

// TODO JH - investigate a way to use govuk-colours
// they compile, but TS doesn't import them in a nice way - govuk-react does the same thing but suppresses the errors.
const govukRed = '#d4351c';
const govukErrorBorderWidth = '2px';

const StyledSearchBox = styled(SearchBox)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const IndicatorSearchForm = ({
  searchFormState,
}: {
  searchFormState: IndicatorSearchFormState;
}) => {
  return (
    <FormGroup
      error={searchFormState.message != undefined}
      data-testid="indicator-search-form"
    >
      {searchFormState.message ? (
        <ErrorText>{searchFormState.message}</ErrorText>
      ) : (
        ''
      )}
      <StyledSearchBox name="indicator" id="indicator">
        {SearchBox.Input && ( // TODO - how do I add props to a styled component?
          <SearchBox.Input
            //role="textbox"
            data-testid="search-form-input-indicator"
            defaultValue={searchFormState.indicator}
            style={
              searchFormState.message
                ? {
                    borderColor: govukRed,
                    borderWidth: govukErrorBorderWidth,
                    borderStyle: 'solid',
                  }
                : {}
            }
          />
        )}
        {SearchBox.Button && <SearchBox.Button type="submit" />}
      </StyledSearchBox>
    </FormGroup>
  );
};
