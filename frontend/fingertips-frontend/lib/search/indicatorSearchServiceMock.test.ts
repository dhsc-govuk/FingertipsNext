import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { IIndicatorSearchService, IndicatorDocument } from './searchTypes';

describe('IndicatorSearchServiceMock', () => {
  const mockData: IndicatorDocument[] = [
    {
      indicatorID: '1',
      indicatorName: 'Red faced',
      indicatorDefinition:
        'Count of people who did something they are embarrassed by',
      earliestDataPeriod: '1938',
      latestDataPeriod: '2023',
      dataSource: 'The Beano',
      lastUpdatedDate: new Date('December 6, 2024'),
      associatedAreaCodes: ['Area1'],
      unitLabel: '',
      hasInequalities: false,
      usedInPoc: true,
    },
    {
      indicatorID: '2',
      indicatorName: 'Perp count',
      indicatorDefinition: 'Perps brought to justice by Red Angel',
      earliestDataPeriod: '1977',
      latestDataPeriod: '2022',
      dataSource: 'Mega City 1',
      lastUpdatedDate: new Date('November 5, 2023'),
      associatedAreaCodes: ['Area1', 'Area2'],
      unitLabel: '',
      hasInequalities: true,
      usedInPoc: true,
    },
  ];
  let indicatorSearchMock: IIndicatorSearchService;
  beforeAll(() => {
    indicatorSearchMock = new IndicatorSearchServiceMock(mockData);
  });
  it('should be successfully instantiated', async () => {
    expect(indicatorSearchMock).toBeInstanceOf(IndicatorSearchServiceMock);
  });

  describe('searchWith', () => {
    it('should perform a search operation on name', async () => {
      expect(await indicatorSearchMock.searchWith('faced')).toEqual([
        mockData[0],
      ]);
    });

    it('should perform a search operation on definition', async () => {
      expect(await indicatorSearchMock.searchWith('justice')).toEqual([
        mockData[1],
      ]);
    });

    it('should filter out any not in Area1', async () => {
      expect(await indicatorSearchMock.searchWith('Red', ['Area1'])).toEqual(
        mockData
      );
    });

    it('should filter out any not in Area2', async () => {
      expect(await indicatorSearchMock.searchWith('Red', ['Area2'])).toEqual([
        mockData[1],
      ]);
    });

    it('should filter all out if unknown area', async () => {
      expect(
        await indicatorSearchMock.searchWith('justice', ['Leamington Spa'])
      ).toHaveLength(0);
    });

    it('indicator should be case agnostic', async () => {
      expect(await indicatorSearchMock.searchWith('Justice')).toEqual([
        mockData[1],
      ]);
    });

    it('area should be case agnostic', async () => {
      expect(
        await indicatorSearchMock.searchWith('justice', ['area2'])
      ).toEqual([mockData[1]]);
    });
  });

  describe('getDocument', () => {
    it('should return the document corresponding to a given documentId', async () => {
      expect(await indicatorSearchMock.getIndicator('2')).toEqual(mockData[1]);
    });

    it('should return nothing if given an invalid document id', async () => {
      expect(
        await indicatorSearchMock.getIndicator('invalid id')
      ).toBeUndefined();
    });
  });
});
