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
  indicatorSearchFormState,
}: {
  indicatorSearchFormState: IndicatorSearchFormState;
}) => {
  return (
    <FormGroup
      error={indicatorSearchFormState.message !== undefined}
      data-testid="indicator-search-form"
    >
      {indicatorSearchFormState.message ? (
        <ErrorText data-testid="indicator-search-form-error">
          {indicatorSearchFormState.message}
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
            defaultValue={indicatorSearchFormState.indicator}
            style={
              indicatorSearchFormState.errors
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
