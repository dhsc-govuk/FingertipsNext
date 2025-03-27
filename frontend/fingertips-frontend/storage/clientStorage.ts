export enum ClientStorageKeys {
  AreaFilterHomePage = 'area-filter-home-page',
  AreaFilterResultsPage = 'area-filter-results-page',
  AreaFilterChartPage = 'area-filter-chart-page',
  previousPath = 'previous-path',
}

export type ClientStorageState = {
  [ClientStorageKeys.AreaFilterHomePage]?: boolean;
  [ClientStorageKeys.AreaFilterResultsPage]?: boolean;
  [ClientStorageKeys.AreaFilterChartPage]?: boolean;
  [ClientStorageKeys.previousPath]?: string;
};

export const CLIENT_STORE_KEY = 'fs-clientstorage-state';

export class ClientStorage {
  public static updateState<T>(storageKey: ClientStorageKeys, storageValue: T) {
    const oldStore = JSON.parse(
      sessionStorage?.getItem(CLIENT_STORE_KEY) || '{}'
    ) as ClientStorageState;

    const updatedStore = {
      ...oldStore,
      [storageKey]: storageValue,
    };

    sessionStorage.setItem(CLIENT_STORE_KEY, JSON.stringify(updatedStore));
  }

  public static getState<T>(storageKey: ClientStorageKeys): T | undefined {
    // if (typeof window !== 'undefined') {
    const item = sessionStorage?.getItem(CLIENT_STORE_KEY);

    if (item) {
      try {
        const store = JSON.parse(item) as ClientStorageState;
        return store[storageKey] as T;
      } catch (e) {
        console.log(`Error parsing state ${item} ${e}`);
        return undefined;
      }
    }
    // }
  }
}
