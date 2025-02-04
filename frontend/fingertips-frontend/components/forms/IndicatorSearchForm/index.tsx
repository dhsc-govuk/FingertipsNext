import { ErrorText, FormGroup, SearchBox } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './indicatorSearchActions';

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
      error={searchFormState.message !== undefined}
      data-testid="indicator-search-form"
    >
      {searchFormState.message ? (
        <ErrorText data-testid="indicator-search-form-error">
          {searchFormState.message}
        </ErrorText>
      ) : (
        ''
      )}
      <StyledSearchBox>
        {SearchBox.Input && (
          <SearchBox.Input
            title="indicator"
            id="indicator"
            name="indicator"
            data-testid="indicator-search-form-input"
            defaultValue={searchFormState.indicator}
            style={
              searchFormState.errors
                ? {
                    borderColor: govukRed,
                    borderWidth: govukErrorBorderWidth,
                    borderStyle: 'solid',
                  }
                : {}
            }
          />
        )}
        {SearchBox.Button && (
          <SearchBox.Button
            type="submit"
            data-testid="indicator-search-form-submit"
          />
        )}
      </StyledSearchBox>
    </FormGroup>
  );
};
