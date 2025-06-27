import { mockDeep } from 'vitest-mock-extended';
import { AreaTypeKeys, englandAreaType, nhsRegionsAreaType } from './areaType';
import { getSelectedAreasDataByAreaType } from './getSelectedAreasData';
import { Area, AreasApi } from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { maxNumAreasThatCanBeRequestedAPI } from '../chunkArray';

const mockAreasApi = mockDeep<AreasApi>();
ApiClientFactory.getAreasApiClient = () => mockAreasApi;

const generateMockArea = (
  areaCode: string,
  areaTypeKey: AreaTypeKeys
): Area => ({
  code: areaCode,
  name: `name-${areaCode}`,
  areaType: {
    key: areaTypeKey,
    name: 'some name',
    level: 2,
    hierarchyName: 'NHS',
  },
});

describe('getSelectedAreasDataByAreaType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array when areas selected is undefined', async () => {
    const selectedAreasData = await getSelectedAreasDataByAreaType(
      undefined,
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(selectedAreasData).toEqual([]);
  });

  it('should return an empty array when areas selected is an empty array', async () => {
    const selectedAreasData = await getSelectedAreasDataByAreaType(
      [],
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(selectedAreasData).toEqual([]);
  });

  it('should return an array of selectedAreasData returned from the API for the selected areas provided', async () => {
    const area1 = generateMockArea('A001', 'nhs-regions');
    const area2 = generateMockArea('A002', 'nhs-regions');
    const area3 = generateMockArea('A003', 'nhs-regions');

    mockAreasApi.getAreas.mockResolvedValue([area1, area2, area3]);

    const selectedAreasData = await getSelectedAreasDataByAreaType(
      ['A001', 'A002', 'A003'],
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(mockAreasApi.getAreas).toHaveBeenCalledWith(
      { areaCodes: ['A001', 'A002', 'A003'] },
      API_CACHE_CONFIG
    );
    expect(selectedAreasData).toEqual([area1, area2, area3]);
  });

  it('should return an array of selectedAreasData and filter out areas that do not match the areaType provided', async () => {
    const area1 = generateMockArea('A001', 'nhs-regions');
    const area2 = generateMockArea('A002', 'nhs-regions');
    const area3 = generateMockArea('A001', 'nhs-primary-care-networks');
    const area4 = generateMockArea('A002', 'nhs-primary-care-networks');

    mockAreasApi.getAreas.mockResolvedValue([area1, area2, area3, area4]);

    const selectedAreasData = await getSelectedAreasDataByAreaType(
      ['A001', 'A002'],
      nhsRegionsAreaType.key as AreaTypeKeys
    );

    expect(mockAreasApi.getAreas).toHaveBeenCalledWith(
      { areaCodes: ['A001', 'A002'] },
      API_CACHE_CONFIG
    );
    expect(selectedAreasData).toEqual([area1, area2]);
  });

  it('should throw an error if no areaData is found for any of the areaSelected', async () => {
    mockAreasApi.getAreas.mockResolvedValue([]);

    await expect(
      async () => await getSelectedAreasDataByAreaType(['A001', 'A002'])
    ).rejects.toThrow('No area data found for any of the areas selected');
  });

  it('should return the selectedAreaData of the areas that were found', async () => {
    const area1 = generateMockArea('A001', 'nhs-regions');
    mockAreasApi.getAreas.mockResolvedValue([area1]);

    const selectedAreaData = await getSelectedAreasDataByAreaType(
      ['A001', 'A002'],
      'nhs-regions'
    );

    expect(selectedAreaData).toEqual([area1]);
  });

  it('should default to filtering by england areaType when areaTypeSelected in not provided', async () => {
    const area1 = generateMockArea('A001', englandAreaType.key as AreaTypeKeys);
    mockAreasApi.getAreas.mockResolvedValue([area1]);

    const selectedAreaData = await getSelectedAreasDataByAreaType(['A001']);

    expect(selectedAreaData).toEqual([area1]);
  });

  it('should make the appropriate number of API calls when a long list of areas is requested', async () => {
    const area1 = generateMockArea('A001', 'nhs-regions');
    const area2 = generateMockArea('A002', 'nhs-regions');

    mockAreasApi.getAreas.mockResolvedValue([area1, area2]);

    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill('a');

    await getSelectedAreasDataByAreaType(testAreas, 'nhs-regions');

    expect(mockAreasApi.getAreas).toHaveBeenCalledTimes(2);
    expect(mockAreasApi.getAreas).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: new Array(maxNumAreasThatCanBeRequestedAPI).fill('a'),
      },
      API_CACHE_CONFIG
    );
    expect(mockAreasApi.getAreas).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: ['a'],
      },
      API_CACHE_CONFIG
    );
  });

  it('should return combined data when a long list of areas is requested', async () => {
    const area1 = generateMockArea('A001', 'nhs-regions');
    const area2 = generateMockArea('A002', 'nhs-regions');
    const area3 = generateMockArea('A003', 'nhs-regions');
    const area4 = generateMockArea('A004', 'nhs-regions');

    mockAreasApi.getAreas.mockResolvedValueOnce([area1, area2]);
    mockAreasApi.getAreas.mockResolvedValueOnce([area3, area4]);

    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill('a');

    const selectedAreaData = await getSelectedAreasDataByAreaType(
      testAreas,
      'nhs-regions'
    );

    expect(selectedAreaData).toEqual([area1, area2, area3, area4]);
  });
});
