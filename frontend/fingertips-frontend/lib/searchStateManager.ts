export enum SearchParams {
  SearchedIndicator = 'si',
  IndicatorsSelected = 'is',
  AreasSelected = 'as',
  AreaTypeSelected = 'ats',
}

export type SearchStateParams = {
  [SearchParams.SearchedIndicator]?: string;
  [SearchParams.IndicatorsSelected]?: string | string[];
  [SearchParams.AreasSelected]?: string | string[];
  [SearchParams.AreaTypeSelected]?: string;
};

export type SearchState = {
  searchedIndicator?: string;
  indicatorsSelected?: string[];
  areasSelected?: string[];
  areaTypeSelected?: string;
};

export class SearchStateManager {
  private searchState: SearchState;
  private searchStateParams: URLSearchParams;

  constructor(searchState: SearchState) {
    this.searchState = {
      searchedIndicator: searchState.searchedIndicator,
      indicatorsSelected: searchState.indicatorsSelected ?? [],
      areaTypeSelected: searchState.areaTypeSelected,
    };
    this.searchStateParams = new URLSearchParams();
  }

  private constructPath(path: string) {
    if (this.searchStateParams.size === 0) {
      return path;
    }
    return `${path}?${this.searchStateParams.toString()}`;
  }

  private addSearchedIndicatorToPath() {
    if (this.searchState.searchedIndicator) {
      this.searchStateParams.append(
        SearchParams.SearchedIndicator,
        this.searchState.searchedIndicator
      );
    }
  }

  private addAreaTypeSelectedToPath() {
    if (this.searchState.areaTypeSelected) {
      this.searchStateParams.append(
        SearchParams.AreaTypeSelected,
        this.searchState.areaTypeSelected
      );
    }
  }

  private addIndicatorsSelectedToPath() {
    if (
      this.searchState.indicatorsSelected &&
      this.searchState.indicatorsSelected.length > 0
    ) {
      this.searchState.indicatorsSelected?.forEach((indicator) => {
        this.searchStateParams.append(
          SearchParams.IndicatorsSelected,
          indicator
        );
      });
    }
  }

  public setAreaTypeSelected(areaTypeSelected: string) {
    this.searchState.areaTypeSelected = areaTypeSelected;
  }

  public addIndicatorSelected(indicatorId: string) {
    this.searchState.indicatorsSelected?.push(indicatorId);
  }

  public removeIndicatorSelected(indicatorId: string) {
    this.searchState = {
      ...this.searchState,
      indicatorsSelected: this.searchState.indicatorsSelected?.filter((ind) => {
        return ind !== indicatorId;
      }),
    };
  }

  public static setStateFromParams(params: URLSearchParams) {
    const searchedIndicator =
      params.get(SearchParams.SearchedIndicator) ?? undefined;
    const indicatorsSelected =
      params.getAll(SearchParams.IndicatorsSelected) ?? [];
    const areaTypeSelected =
      params.get(SearchParams.AreaTypeSelected) ?? undefined;

    const searchStateManager = new SearchStateManager({
      searchedIndicator,
      indicatorsSelected,
      areaTypeSelected,
    });
    return searchStateManager;
  }

  public getSearchState() {
    return this.searchState;
  }

  public generatePath(path: string) {
    this.searchStateParams = new URLSearchParams();

    this.addSearchedIndicatorToPath();
    this.addIndicatorsSelectedToPath();
    this.addAreaTypeSelectedToPath();

    return this.constructPath(path);
  }
}
