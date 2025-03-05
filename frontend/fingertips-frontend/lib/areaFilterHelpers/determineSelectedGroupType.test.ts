import {
  nhsIntegratedCareBoardsAreaType,
  nhsPrimaryCareNetworksAreaType,
  nhsRegionsAreaType,
} from './areaType';
import { determineSelectedGroupType } from './determineSelectedGroupType';

describe('DetermineSelectedGroupType', () => {
  it('should always return the selectedGroupType if provided', () => {
    const selectedGroupType = determineSelectedGroupType(
      'nhs-integrated-care-boards'
    );

    expect(selectedGroupType).toEqual('nhs-integrated-care-boards');
  });

  it('should return the first areaType from the availableGroupTypes provided', () => {
    const selectedGroupType = determineSelectedGroupType(undefined, [
      nhsRegionsAreaType,
      nhsIntegratedCareBoardsAreaType,
      nhsPrimaryCareNetworksAreaType,
    ]);

    expect(selectedGroupType).toEqual(nhsRegionsAreaType.key);
  });

  it('should return "england" as the default group type when selectedGroupType or availableGroupTypes are not provided', () => {
    const selectedGroupType = determineSelectedGroupType();

    expect(selectedGroupType).toEqual('england');
  });
});
