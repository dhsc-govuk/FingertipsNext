import { ErrorText, FormGroup, SearchBox } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { IndicatorSearchFormState } from './indicatorSearchActions';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { useLoadingState } from '@/context/LoaderContext';
import { ChangeEvent, useEffect, useState } from 'react';
import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';
import { CharacterCount } from '@/components/atoms/CharacterCount';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import {
  StyledHintParagraph,
  StyledTitleParagraph,
} from '@/lib/formHelpers/formStyling';

const govukErrorBorderWidth = '2px';

const StyledSearchBox = styled(SearchBox)(
  spacing.withWhiteSpace({ marginBottom: 1 })
);

const StyledFormGroup = styled(FormGroup)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const IndicatorSearchForm = ({
  indicatorSearchFormState,
}: {
  indicatorSearchFormState: IndicatorSearchFormState;
}) => {
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();
  const indicatorSearchTerm = indicatorSearchFormState.indicator;
  const [inputTextLength, setInputTextLength] = useState(
    indicatorSearchTerm.length
  );

  useEffect(() => {
    if (indicatorSearchFormState.message) {
      setIsLoading(false);
    }
  });

  return (
    <StyledFormGroup
      error={indicatorSearchFormState.message !== undefined}
      data-testid="indicator-search-form"
    >
      <input
        key={`indicator-search-form-state-${JSON.stringify(searchState)}`}
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      <StyledTitleParagraph>Search by subject</StyledTitleParagraph>
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInputTextLength(e.target.value.length);
            }}
            title="indicator"
            id="indicator"
            name="indicator"
            data-testid="indicator-search-form-input"
            defaultValue={indicatorSearchTerm}
            maxLength={INDICATOR_SEARCH_MAX_CHARACTERS}
            style={
              indicatorSearchFormState.errors
                ? {
                    borderColor: GovukColours.Red,
                    borderWidth: govukErrorBorderWidth,
                    borderStyle: 'solid',
                    fontSize: '19px',
                  }
                : { fontSize: '19px' }
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
      <CharacterCount
        textLength={inputTextLength}
        characterLimit={INDICATOR_SEARCH_MAX_CHARACTERS}
        thresholdPercentage={75}
      />
    </StyledFormGroup>
  );
};
