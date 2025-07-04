import type { SeedDataPromises } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { seedDataFromPromises } from '@/components/atoms/SeedQueryCache/seedDataFromPromises';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

describe('seedDataFromPromises', () => {
  it('resolves promises and maps results to keys', async () => {
    const mockSeedDataPromises: SeedDataPromises = {
      metaData: Promise.resolve(mockIndicatorDocument()),
      indicatorHealthData: Promise.resolve(
        mockIndicatorWithHealthDataForArea()
      ),
    };

    const result = await seedDataFromPromises(mockSeedDataPromises);

    expect(result).toEqual({
      metaData: mockIndicatorDocument(),
      indicatorHealthData: mockIndicatorWithHealthDataForArea(),
    });
  });

  it('handles empty input gracefully', async () => {
    const mockSeedDataPromises: SeedDataPromises = {};

    const result = await seedDataFromPromises(mockSeedDataPromises);

    expect(result).toEqual({});
  });
});
