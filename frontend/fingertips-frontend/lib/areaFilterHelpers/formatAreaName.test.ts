import { AreaTypeKeys, gpsAreaType, nhsRegionsAreaType } from './areaType';
import { formatAreaName } from './formatAreaName';

describe('formatAreaName', () => {
  it('should return the areaCode and areaName provided when the areaTypeKey is gps', () => {
    const formattedAreaName = formatAreaName(
      'A001',
      'Some name',
      gpsAreaType.key as AreaTypeKeys,
      'Some postcode'
    );

    expect(formattedAreaName).toEqual('A001 - Some name Some postcode');
  });

  it('should just return the areaName provided when the areaTypeKey is not gps', () => {
    const formattedAreaName = formatAreaName(
      'A001',
      'Some name',
      nhsRegionsAreaType.key as AreaTypeKeys,
      'Some postcode'
    );

    expect(formattedAreaName).toEqual('Some name');
  });
});
