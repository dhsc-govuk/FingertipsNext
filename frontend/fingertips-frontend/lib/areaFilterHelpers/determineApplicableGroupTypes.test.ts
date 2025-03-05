import { determineApplicableGroupTypes } from './determineApplicableGroupTypes';
import { allAreaTypes, AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

describe('determineApplicableGroupTypes', () => {
  it('should return undefined if allAreaTypes is undefined', () => {
    const groupTypes = determineApplicableGroupTypes(
      undefined,
      'nhs-primary-care-networks'
    );

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if selectedAreaType is undefined', () => {
    const groupTypes = determineApplicableGroupTypes(allAreaTypes);

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if allAreaType is an empty array', () => {
    const groupTypes = determineApplicableGroupTypes([]);

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if the selectedAreaType could not be found', () => {
    const mockAreaTypesWithoutICB = allAreaTypes.filter(
      (areaType) => areaType.key !== 'nhs-integrated-care-boards'
    );

    const groupTypes = determineApplicableGroupTypes(
      mockAreaTypesWithoutICB,
      'nhs-integrated-care-boards'
    );

    expect(groupTypes).toBeUndefined();
  });

  type determineApplicableGroupTypesSet = [
    selectedAreaType: AreaTypeKeys,
    expectedGroupTypes: AreaTypeKeys[],
  ];

  it.each<determineApplicableGroupTypesSet>([
    ['england', []],
    ['nhs-regions', ['england']],
    ['nhs-integrated-care-boards', ['nhs-regions', 'england']],
    [
      'nhs-sub-integrated-care-boards',
      ['nhs-integrated-care-boards', 'nhs-regions', 'england'],
    ],
    [
      'nhs-primary-care-networks',
      [
        'nhs-sub-integrated-care-boards',
        'nhs-integrated-care-boards',
        'nhs-regions',
      ],
    ],
    ['gps', ['nhs-primary-care-networks', 'nhs-sub-integrated-care-boards']],
    ['regions', ['england']],
    ['combined-authorities', ['regions', 'england']],
    [
      'counties-and-unitary-authorities',
      ['combined-authorities', 'regions', 'england'],
    ],
    [
      'districts-and-unitary-authorities',
      [
        'counties-and-unitary-authorities',
        'combined-authorities',
        'regions',
        'england',
      ],
    ],
  ])(
    'when selectedAreaType is %p should return these applicable groupType %p',
    (selectedAreaType, expectedGroupTypes) => {
      const applicableGroupTypes = determineApplicableGroupTypes(
        allAreaTypes,
        selectedAreaType
      );

      expect(applicableGroupTypes?.length).toEqual(expectedGroupTypes.length);

      applicableGroupTypes?.forEach((groupType) => {
        const doesKeyExistInExpected = expectedGroupTypes.some(
          (expectedGroupTypeKey) => expectedGroupTypeKey === groupType.key
        );
        expect(doesKeyExistInExpected).toBeTruthy();
      });
    }
  );
});
