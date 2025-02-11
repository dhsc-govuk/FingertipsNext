import { mockAreaTypes } from '@/mock/data/areaData';
import { determineApplicableGroupTypes } from './determineApplicableGroupTypes';

describe('determineApplicableGroupTypes', () => {
  it('should return undefined if allAreaTypes is undefined', () => {
    const groupTypes = determineApplicableGroupTypes(undefined, 'PCN');

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if selectedAreaType is undefined', () => {
    const groupTypes = determineApplicableGroupTypes(mockAreaTypes);

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if allAreaType is an empty array', () => {
    const groupTypes = determineApplicableGroupTypes([]);

    expect(groupTypes).toBeUndefined();
  });

  it('should return undefined if the selectedAreaType could not be found', () => {
    const mockAreaTypesWithoutICB = mockAreaTypes.filter(
      (areaType) => areaType.name !== 'ICB'
    );

    const groupTypes = determineApplicableGroupTypes(
      mockAreaTypesWithoutICB,
      'ICB'
    );

    expect(groupTypes).toBeUndefined();
  });

  it.each([
    ['England', []],
    ['NHS Regions', ['England']],
    ['NHS Integrated Care Boards', ['NHS Regions', 'England']],
    [
      'NHS Primary Care Networks',
      [
        'NHS Sub Integrated Care Boards',
        'NHS Integrated Care Boards',
        'NHS Regions',
        'England',
      ],
    ],
    [
      'GPs',
      [
        'NHS Primary Care Networks',
        'NHS Sub Integrated Care Boards',
        'NHS Integrated Care Boards',
        'NHS Regions',
        'England',
      ],
    ],
    ['Regions', ['England']],
    ['Counties and Unitary Authorities', ['Regions', 'England']],
  ])(
    'when selectedAreaType is %p should return these applicable groupType %p',
    (selectedAreaType, expectedGroupTypes) => {
      const applicableGroupTypes = determineApplicableGroupTypes(
        mockAreaTypes,
        selectedAreaType
      );

      expect(applicableGroupTypes).toEqual(
        expect.arrayContaining(expectedGroupTypes)
      );
    }
  );
});
