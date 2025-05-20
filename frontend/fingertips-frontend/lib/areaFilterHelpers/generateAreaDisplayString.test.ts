import { AreaTypeKeys, gpsAreaType, nhsRegionsAreaType } from './areaType';
import { generateAreaDisplayString } from './generateAreaDisplayString';

describe('generateAreaDisplayString', () => {
  it('should return the areaCode and areaName provided when the areaTypeKey is gps', () => {
    const formattedAreaName = generateAreaDisplayString(
      'A001',
      'Some name',
      gpsAreaType.key as AreaTypeKeys,
      'Some postcode'
    );

    expect(formattedAreaName).toEqual('A001 - Some name Some postcode');
  });

  it('should just return the areaName provided when the areaTypeKey is not gps', () => {
    const formattedAreaName = generateAreaDisplayString(
      'A001',
      'Some name',
      nhsRegionsAreaType.key as AreaTypeKeys,
      'Some postcode'
    );

    expect(formattedAreaName).toEqual('Some name Some postcode');
  });

  it('should return nothing when postcode is not provided', () => {
    const formattedAreaName = generateAreaDisplayString(
      'A001',
      'Some name',
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(formattedAreaName).toEqual('Some name');
  });
});
