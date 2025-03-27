export enum ClientStorageKeys {
  AreaFilterHomePage = 'area-filter-home-page',
  AreaFilterResultsPage = 'area-filter-results-page',
  AreaFilterChartPage = 'area-filter-chart-page',
  previousPath = 'previous-path',
  searchedIndicator = 'searched-indicator',
}

export type ClientStorageState = {
  [ClientStorageKeys.AreaFilterHomePage]?: boolean;
  [ClientStorageKeys.AreaFilterResultsPage]?: boolean;
  [ClientStorageKeys.AreaFilterChartPage]?: boolean;
  [ClientStorageKeys.previousPath]?: string;
  [ClientStorageKeys.searchedIndicator]?: string;
};

export const CLIENT_STORE_KEY = 'fs-clientstorage-state';

export class ClientStorage {
  public static updateState<T>(storageKey: ClientStorageKeys, storageValue: T) {
    const oldStore = JSON.parse(
      localStorage.getItem('store') ?? '{}'
    ) as ClientStorageState;

    const updatedStore = {
      ...oldStore,
      [storageKey]: storageValue,
    };

    localStorage.setItem(CLIENT_STORE_KEY, JSON.stringify(updatedStore));
  }

  public static getState<T>(storageKey: ClientStorageKeys): T | undefined {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(CLIENT_STORE_KEY);

      if (item) {
        const store = JSON.parse(item) as ClientStorageState;

        return store[storageKey] as T;
      }
    }

    return undefined;
  }
}
