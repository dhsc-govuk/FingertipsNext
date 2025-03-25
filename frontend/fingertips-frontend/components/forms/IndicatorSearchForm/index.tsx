import { ErrorText, FormGroup, Paragraph, SearchBox } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SearchStateParams } from '@/lib/searchStateManager';
import { useLoader } from '@/context/LoaderContext';

const govukErrorBorderWidth = '2px';

const StyledSearchBox = styled(SearchBox)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

const StyledTitleParagraph = styled(styled(Paragraph)`
  padding-bottom: 2px;
`)(spacing.withWhiteSpace({ marginBottom: 0 }));

const StyledHintParagraph = styled(styled(Paragraph)`
  color: ${GovukColours.DarkGrey};
`)(spacing.withWhiteSpace({ marginBottom: 3 }));

export const IndicatorSearchForm = ({
  indicatorSearchFormState,
  searchState,
}: {
  indicatorSearchFormState: IndicatorSearchFormState;
  searchState?: SearchStateParams;
}) => {
  const { setIsLoading } = useLoader();

  return (
    <FormGroup
      error={indicatorSearchFormState.message !== undefined}
      data-testid="indicator-search-form"
    >
      <input
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      <StyledTitleParagraph>Search by Subject</StyledTitleParagraph>
      <StyledHintParagraph>
        For example, smoking, diabetes prevalence, or a specific indicator ID
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
                    borderColor: GovukColours.Red,
                    borderWidth: govukErrorBorderWidth,
                    borderStyle: 'solid',
                  }
                : {}
            }
          />
        )}
        {SearchBox.Button && (
          <SearchBox.Button
            onClick={() => setIsLoading(true)}
            type="submit"
            data-testid="indicator-search-form-submit"
          />
        )}
      </StyledSearchBox>
    </FormGroup>
  );
};
