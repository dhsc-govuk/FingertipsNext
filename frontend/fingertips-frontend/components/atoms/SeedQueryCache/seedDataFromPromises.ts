import {
  SeedData,
  SeedDataPromises,
} from '@/components/atoms/SeedQueryCache/seedQueryCache.types';

export const seedDataFromPromises = async (seedPromises: SeedDataPromises) => {
  const promises = Object.values(seedPromises);
  const results = await Promise.all(promises);
  const seedData: SeedData = {};
  Object.keys(seedPromises).forEach((key, index) => {
    seedData[key] = results[index];
  });
  return seedData;
};
