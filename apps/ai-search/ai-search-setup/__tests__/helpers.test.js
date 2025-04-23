import { createDistrictLevelFromCounty } from '../src/utils/helpers';

describe('Helpers file', () => {
  test('createDistrictLevelFromCounty should find and convert areas', async () => {
    const myTestAreas = [
      {
        areaKey: 'E06000001_someName',
        areaCode: 'E06000001',
        areaName: 'someName',
        areaType: 'Blah',
      },
      {
        areaKey: 'E07000001_someName',
        areaCode: 'E07000001',
        areaName: 'someName',
        areaType: 'Blah',
      },
      {
        areaKey: 'E08000001_someName',
        areaCode: 'E08000001',
        areaName: 'someName',
        areaType: 'Blah',
      },
      {
        areaKey: 'E09000001_someName',
        areaCode: 'E09000001',
        areaName: 'someName',
        areaType: 'Blah',
      },
    ];
    const newAreas = createDistrictLevelFromCounty(myTestAreas);

    expect(newAreas.length).toBe(3);
  });
});
