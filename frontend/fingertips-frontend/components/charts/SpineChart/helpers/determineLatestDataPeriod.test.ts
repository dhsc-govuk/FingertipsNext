import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { determineLatestDataPeriod } from './determineLatestDataPeriod';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

describe('determineLatestDataPeriod', () => {
  it('returns the latest year from the first area health data when present', () => {
    const areasHealthData: HealthDataForArea[] = [
      mockHealthDataForArea({
        areaCode: 'A1',
        healthData: [
          mockHealthDataPoint({ year: 2020 }),
          mockHealthDataPoint({ year: 2021 }),
          mockHealthDataPoint({ year: 2022 }),
        ],
      }),
    ];
    const englandData = null;
    expect(determineLatestDataPeriod(areasHealthData, englandData)).toBe(2022);
  });

  it('returns the first year from englandData if areasHealthData is empty', () => {
    const areasHealthData: HealthDataForArea[] = [];
    const englandData: HealthDataForArea = mockHealthDataForArea({
      areaCode: areaCodeForEngland,
      healthData: [
        mockHealthDataPoint({ year: 2019 }),
        mockHealthDataPoint({ year: 2018 }),
      ],
    });
    expect(determineLatestDataPeriod(areasHealthData, englandData)).toBe(2019);
  });

  it('returns the first year from englandData if first area health data has no healthData', () => {
    const areasHealthData: HealthDataForArea[] = [
      mockHealthDataForArea({
        areaCode: 'A1',
        healthData: [],
      }),
    ];
    const englandData: HealthDataForArea = mockHealthDataForArea({
      areaCode: areaCodeForEngland,
      healthData: [
        mockHealthDataPoint({ year: 2017 }),
        mockHealthDataPoint({ year: 2016 }),
      ],
    });
    expect(determineLatestDataPeriod(areasHealthData, englandData)).toBe(2017);
  });

  it('returns undefined if neither areasHealthData nor englandData have healthData', () => {
    const areasHealthData: HealthDataForArea[] = [
      mockHealthDataForArea({
        areaCode: 'A1',
        healthData: [],
      }),
    ];
    const englandData: HealthDataForArea = mockHealthDataForArea({
      areaCode: areaCodeForEngland,
      healthData: [],
    });
    expect(
      determineLatestDataPeriod(areasHealthData, englandData)
    ).toBeUndefined();
  });

  it('returns undefined if both areasHealthData and englandData are empty', () => {
    expect(determineLatestDataPeriod([], null)).toBeUndefined();
  });
});
