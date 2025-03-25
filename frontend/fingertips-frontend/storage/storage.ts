export enum StorageKeys {
  AreaFilterHomePage = 'area-filter-home-page',
  AreaFilterResultsPage = 'area-filter-results-page',
  AreaFilterChartPage = 'area-filter-chart-page',
}

export type AppStorageState = {
  [StorageKeys.AreaFilterHomePage]?: boolean;
  [StorageKeys.AreaFilterResultsPage]?: boolean;
  [StorageKeys.AreaFilterChartPage]?: boolean;
};

export class AppStorage {
  public static updateState<T>(storageKey: StorageKeys, storageValue: T) {
    const oldStore = JSON.parse(
      localStorage.getItem('store') ?? '{}'
    ) as AppStorageState;

    const updatedStore = {
      ...oldStore,
      [storageKey]: storageValue,
    };

    localStorage.setItem('store', JSON.stringify(updatedStore));
  }

  public static getState<T>(storageKey: StorageKeys): T | undefined {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem('store');

      if (item) {
        const store = JSON.parse(item) as AppStorageState;

        return store[storageKey] as T;
      }
    }

    return undefined;
  }
}
