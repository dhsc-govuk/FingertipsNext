import { QuartileData } from '@/generated-sources/ft-api-client';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockAgeData } from '@/mock/data/mockAgeData';

export const mockQuartileData = (
  overrides?: Partial<QuartileData>
): QuartileData => ({
  indicatorId: 41101,
  year: 2023,
  polarity: 'LowIsGood',
  q0Value: 11.5,
  q1Value: 13.3,
  q2Value: 14.2,
  q3Value: 15.5,
  q4Value: 19.2,
  areaValue: 19.2,
  ancestorValue: 14.8,
  englandValue: 14.8,
  sex: mockSexData(),
  age: mockAgeData(),
  ...overrides,
});
