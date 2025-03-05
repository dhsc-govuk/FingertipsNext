import { AreaTypeKeys, gpsAreaType, nhsRegionsAreaType } from './areaType';
import { formatAreaName } from './formatAreaName';

describe('formatAreaName', () => {
  it('should return the areaCode and areaName provided when the areaTypeKey is gps', () => {
    const formattedAreaName = formatAreaName(
      'A001',
      'Some name',
      gpsAreaType.key as AreaTypeKeys
    );

    expect(formattedAreaName).toEqual('A001 - Some name');
  });

  it('should just return the areaName provided when the areaTypeKey is not gps', () => {
    const formattedAreaName = formatAreaName(
      'A001',
      'Some name',
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(formattedAreaName).toEqual('Some name');
  });
});
