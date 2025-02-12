import { ErrorText, FormGroup, Paragraph, SearchBox } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './indicatorSearchActions';

const govukBlack = '#0b0c0c';
const govukLightGrey = '#505a5f';
const govukRed = '#d4351c';
const govukErrorBorderWidth = '2px';

const StyledSearchBox = styled(SearchBox)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

const StyledTitleParagraph = styled(styled(Paragraph)`
  padding-bottom: 2px;
  color: ${govukBlack};
`)(spacing.withWhiteSpace({ marginBottom: 0 }));
const StyledHintParagraph = styled(styled(Paragraph)`
  color: ${govukLightGrey};
`)(spacing.withWhiteSpace({ marginBottom: 3 }));

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
      <StyledTitleParagraph>Search by Subject</StyledTitleParagraph>
      <StyledHintParagraph>
        For example smoking, diabetes prevalence, or a specific indicator ID
      </StyledHintParagraph>
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
