'use client';

import { BackLink, ErrorSummary, GridCol, GridRow, H1 } from 'govuk-react';
import { useActionState, useEffect } from 'react';
import {
  IndicatorSelectionState,
  submitIndicatorSelection,
} from '../../forms/IndicatorSelectionForm/indicatorSelectionActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';
import { IndicatorSelectionForm } from '@/components/forms/IndicatorSelectionForm';
import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';

type SearchResultsProps = {
  initialIndicatorSelectionState: IndicatorSelectionState;
  searchResults: IndicatorDocument[];
  areaFilterData?: AreaFilterData;
  isEnglandSelectedAsGroup: boolean;
  selectedAreasData?: AreaWithRelations[];
  searchState?: SearchStateParams;
  currentDate?: Date;
};

const generateBackLinkPath = (state?: SearchStateParams) => {
  const stateManager = SearchStateManager.initialise(state);
  return stateManager.generatePath('/');
};

export function SearchResults({
  initialIndicatorSelectionState,
  searchResults,
  areaFilterData,
  selectedAreasData,
  isEnglandSelectedAsGroup,
  searchState,
  currentDate,
}: Readonly<SearchResultsProps>) {
  const { setIsLoading } = useLoadingState();
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState(searchState ?? {});
  }, [searchState, setSearchState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [indicatorSelectionState, indicatorSelectionFormAction] =
    useActionState(submitIndicatorSelection, initialIndicatorSelectionState);

  const backLinkPath = generateBackLinkPath(searchState);

  const initialIndicatorSearchFormState: IndicatorSearchFormState = {
    indicator: searchState?.[SearchParams.SearchedIndicator] ?? '',
    searchState: JSON.stringify(searchState),
  };
  const [indicatorSearchState, indicatorSearchFormAction] = useActionState(
    searchIndicator,
    initialIndicatorSearchFormState
  );

  const searchTerm = searchState?.[SearchParams.SearchedIndicator] ?? '';

  return (
    <>
      <BackLink
        onClick={() => setIsLoading(true)}
        href={backLinkPath}
        data-testid="search-results-back-link"
      />
      <>
        {indicatorSelectionState.message && (
          <ErrorSummary
            errors={[
              {
                targetName: `search-results-indicator-${searchResults[0].indicatorID.toString()}`,
                text: 'Select any indicators you want to view',
              },
            ]}
            data-testid="search-result-form-error-summary"
            onHandleErrorClick={(targetName: string) => {
              const indicator = document.getElementById(targetName);
              indicator?.scrollIntoView(true);
              indicator?.focus();
            }}
          />
        )}
        <H1>Search results{searchTerm ? ` for ${searchTerm}` : null}</H1>
        <form action={indicatorSearchFormAction}>
          <IndicatorSearchForm
            indicatorSearchFormState={indicatorSearchState}
          />
        </form>
        <GridRow>
          <GridCol setWidth="one-third">
            <AreaFilterPane
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
            />
          </GridCol>
          <GridCol>
            <IndicatorSelectionForm
              searchResults={searchResults}
              showTrends={selectedAreasData?.length === 1 || (selectedAreasData?.length === 0 && isEnglandSelectedAsGroup)}
              formAction={indicatorSelectionFormAction}
              currentDate={currentDate}
            />
          </GridCol>
        </GridRow>
      </>
    </>
  );
}
