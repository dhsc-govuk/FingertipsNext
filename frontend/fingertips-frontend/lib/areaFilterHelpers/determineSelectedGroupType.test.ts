import { determineSelectedGroupType } from './determineSelectedGroupType';

describe('DetermineSelectedGroupType', () => {
  it('should always return the selectedGroupType if provided', () => {
    const selectedGroupType = determineSelectedGroupType(
      'nhs-integrated-care-boards'
    );

    expect(selectedGroupType).toEqual('nhs-integrated-care-boards');
  });

  it('should return "england" as the default group type when selectedGroupType is not provided', () => {
    const selectedGroupType = determineSelectedGroupType();

    expect(selectedGroupType).toEqual('england');
  });
});
