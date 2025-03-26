import { ClientStorage, ClientStorageKeys } from './clientStorage';

describe('ClientStorage', () => {
  it('should update the state with the value provided', () => {
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');

    mockGetItem.mockReturnValue(
      JSON.stringify({
        [ClientStorageKeys.AreaFilterHomePage]: true,
      })
    );

    ClientStorage.updateState<string>(
      ClientStorageKeys.previousPath,
      '/some-new-path'
    );

    expect(mockSetItem).toHaveBeenCalledWith(
      'store',
      JSON.stringify({
        [ClientStorageKeys.AreaFilterHomePage]: true,
        [ClientStorageKeys.previousPath]: '/some-new-path',
      })
    );
  });

  it('should get the state for the key provided', () => {
    const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');

    mockGetItem.mockReturnValue(
      JSON.stringify({
        [ClientStorageKeys.AreaFilterHomePage]: true,
        [ClientStorageKeys.previousPath]: '/some-new-path',
      })
    );

    const value = ClientStorage.getState<string>(
      ClientStorageKeys.previousPath
    );

    expect(value).toEqual('/some-new-path');
  });
});
