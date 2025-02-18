import { asArray } from './pageHelpers';

export enum SearchParams {
  SearchedIndicator = 'si',
  IndicatorsSelected = 'is',
  AreasSelected = 'as',
  AreaTypeSelected = 'ats',
  GroupTypeSelected = 'gts',
  ConfidenceIntervalSelected = 'cis',
}

export type SearchParamKeys = `${SearchParams}`;

const multiValueParams = [
  SearchParams.IndicatorsSelected as string,
  SearchParams.AreasSelected as string,
  SearchParams.ConfidenceIntervalSelected as string,
];

export type SearchStateParams = {
  [SearchParams.SearchedIndicator]?: string;
  [SearchParams.IndicatorsSelected]?: string[];
  [SearchParams.AreasSelected]?: string[];
  [SearchParams.AreaTypeSelected]?: string;
  [SearchParams.GroupTypeSelected]?: string;
  [SearchParams.ConfidenceIntervalSelected]?: string[];
};

const isMultiValueTypeParam = (searchParamKey: SearchParamKeys) =>
  multiValueParams.includes(searchParamKey);

export class SearchStateManager {
  private searchState: SearchStateParams;
  private searchStateParams: URLSearchParams;

  constructor(searchState: SearchStateParams = {}) {
    this.searchState = {};
    this.searchStateParams = new URLSearchParams();

    this.searchState = searchState;
  }

  private constructPath(path: string) {
    if (this.searchStateParams.size === 0) {
      return path;
    }
    return `${path}?${this.searchStateParams.toString()}`;
  }

  private addParamToPath(searchParamKey: SearchParamKeys) {
    const paramsToAdd = asArray(this.searchState[searchParamKey]);

    if (paramsToAdd.length > 0) {
      paramsToAdd.forEach((paramToAdd) => {
        this.searchStateParams.append(searchParamKey, paramToAdd);
      });
    }
  }

  public addParamValueToState(
    searchParamKey: SearchParamKeys,
    paramToAdd: string
  ) {
    if (isMultiValueTypeParam(searchParamKey)) {
      const currentParamState = this.searchState[searchParamKey];

      const currentParamStateAsArray = asArray(currentParamState);
      const doesParamExist = currentParamStateAsArray.find(
        (currentParam) => currentParam === paramToAdd
      );

      if (!doesParamExist) {
        const newState: SearchStateParams = {
          ...this.searchState,
          [searchParamKey]: [...currentParamStateAsArray, paramToAdd],
        };

        this.searchState = newState;
      }
    } else {
      const newState: SearchStateParams = {
        ...this.searchState,
        [searchParamKey]: paramToAdd,
      };

      this.searchState = newState;
    }
  }

  public removeParamValueFromState(
    searchParamKey: SearchParamKeys,
    paramToRemove?: string
  ) {
    if (isMultiValueTypeParam(searchParamKey)) {
      const currentParamState = asArray(this.searchState[searchParamKey]);

      const newParamState = currentParamState?.filter((paramValue) => {
        return paramValue !== paramToRemove;
      });

      const newState: SearchStateParams = {
        ...this.searchState,
        [searchParamKey]: newParamState,
      };

      this.searchState = newState;
    } else {
      const newState: SearchStateParams = {
        ...this.searchState,
        [searchParamKey]: undefined,
      };

      this.searchState = newState;
    }
  }

  public removeAllParamFromState(searchParamKey: SearchParamKeys) {
    this.searchState[searchParamKey] = undefined;
  }

  public static setStateFromParams(params: URLSearchParams) {
    const newState = Object.values(SearchParams).reduce<SearchStateParams>(
      (state, searchParamKey) => {
        if (isMultiValueTypeParam(searchParamKey)) {
          const paramValues = params.getAll(searchParamKey);

          if (paramValues.length > 0) {
            const newState: SearchStateParams = {
              ...state,
              [searchParamKey]: paramValues,
            };

            return newState;
          }
        } else {
          const paramValue = params.get(searchParamKey);

          if (paramValue) {
            const newState: SearchStateParams = {
              ...state,
              [searchParamKey]: paramValue,
            };

            return newState;
          }
        }
        return state;
      },
      {}
    );

    const searchStateManager = new SearchStateManager(newState);
    return searchStateManager;
  }

  public static setStateFromSearchStateParams(params?: SearchStateParams) {
    if (params) {
      const newState = Object.values(SearchParams).reduce<SearchStateParams>(
        (state, searchParamKey) => {
          if (isMultiValueTypeParam(searchParamKey)) {
            const paramValues = asArray(params[searchParamKey]);

            if (paramValues.length > 0) {
              const newState: SearchStateParams = {
                ...state,
                [searchParamKey]: paramValues,
              };

              return newState;
            }
          } else {
            const paramValue = params[searchParamKey];

            if (paramValue) {
              const newState: SearchStateParams = {
                ...state,
                [searchParamKey]: paramValue,
              };

              return newState;
            }
          }
          return state;
        },
        {}
      );

      const searchStateManager = new SearchStateManager(newState);
      return searchStateManager;
    }
    return new SearchStateManager();
  }

  public getSearchState() {
    return this.searchState;
  }

  public generatePath(path: string) {
    this.searchStateParams = new URLSearchParams();

    Object.values(SearchParams).forEach((searchParamKey) => {
      this.addParamToPath(searchParamKey);
    });

    return this.constructPath(path);
  }
}
