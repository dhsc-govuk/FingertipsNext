import { Batch, BatchStatusEnum } from '@/generated-sources/ft-api-client';

export const mockBatch = (overrides?: Partial<Batch>): Batch => ({
  batchId: '41101_2020-03-07T14:22:37.123Z',
  indicatorId: 41101,
  originalFilename: 'test-file.csv',
  createdAt: new Date('2020-03-07T14:22:37.123Z'),
  publishedAt: new Date('2020-03-07T14:22:37.123Z'),
  userId: 'fd89acd7-c91f-49c0-89ab-c46d3b25b4f0',
  status: BatchStatusEnum.Received,
  ...overrides,
});
