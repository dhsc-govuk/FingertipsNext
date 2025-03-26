'use client';

import { Button, InputField, H3 } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { AreaAutoCompleteInputField } from '@/components/molecules/AreaAutoCompleteInputField';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  AreaFilterData,
  SelectAreasFilterPanel,
} from '@/components/molecules/SelectAreasFilterPanel';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useLoader } from '@/context/LoaderContext';
import { ClientStorage, ClientStorageKeys } from '@/storage/clientStorage';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

interface SearchFormProps {
  searchState?: SearchStateParams;
  formState: SearchFormState;
  selectedAreasData?: AreaWithRelations[];
  areaFilterData?: AreaFilterData;
}

export const SearchForm = ({
  searchState,
  formState,
  selectedAreasData,
  areaFilterData,
}: Readonly<SearchFormProps>) => {
  const { setIsLoading } = useLoader();

  const isAreaFilterOpen =
    ClientStorage.getState<boolean>(ClientStorageKeys.AreaFilterHomePage) ??
    false;

  const searchedIndicator =
    ClientStorage.getState<string>(ClientStorageKeys.searchedIndicator) ??
    searchState?.[SearchParams.SearchedIndicator] ??
    formState.indicator;

  const updateIsAreaFilterOpen = () => {
    ClientStorage.updateState(
      ClientStorageKeys.AreaFilterHomePage,
      !isAreaFilterOpen
    );
  };

  const selectedAreas = searchState?.[SearchParams.AreasSelected];

  const inputSuggestionDefaultValue =
    searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
      ? areaFilterData?.availableGroups?.find(
          (group) => group.code === searchState?.[SearchParams.GroupSelected]
        )?.name
      : selectedAreasData?.[0]?.name;

  const handleOnSearchSubjectBlur = (searchedIndicator: string) => {
    ClientStorage.updateState<string>(
      ClientStorageKeys.searchedIndicator,
      searchedIndicator
    );

    formState.indicator = searchedIndicator;
  };

  return (
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <input
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: searchedIndicator ?? formState.indicator ?? '',
          onBlur: (e) => handleOnSearchSubjectBlur(e.target.value),
        }}
        hint={
          <div style={{ color: GovukColours.DarkGrey }}>
            For example, smoking, diabetes prevalence, or a specific indicator
            ID
          </div>
        }
        meta={{
          touched: !!formState.message,
          error: 'Enter a subject you want to search for',
        }}
        data-testid="indicator-search-form-input"
      >
        Search by subject
      </StyledInputField>
      <AreaAutoCompleteInputField
        key={`area-auto-complete-${JSON.stringify(searchState)}`}
        inputFieldErrorStatus={!!formState.message}
        searchState={searchState}
        selectedAreaName={inputSuggestionDefaultValue}
      />

      {(selectedAreas && selectedAreas.length > 0) ||
      searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED ? (
        <SelectedAreasPanel
          key={`selected-area-panel-${JSON.stringify(searchState)}`}
          searchState={searchState}
          areaFilterData={areaFilterData}
          selectedAreasData={selectedAreasData}
          isFullWidth={false}
        />
      ) : null}

      <ShowHideContainer
        key={`show-hide-${isAreaFilterOpen}`}
        summary="Filter by area"
        open={isAreaFilterOpen}
        onClickFunction={updateIsAreaFilterOpen}
      >
        <SelectAreasFilterPanel
          key={`area-filter-panel-${JSON.stringify(searchState)}`}
          areaFilterData={areaFilterData}
          searchState={searchState}
        />
      </ShowHideContainer>

      <Button
        type="submit"
        data-testid="search-form-button-submit"
        style={{ marginTop: '25px' }}
        onClick={() => setIsLoading(true)}
      >
        Search
      </Button>
    </div>
  );
};
