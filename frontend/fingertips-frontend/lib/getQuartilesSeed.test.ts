import { mockDeep } from 'vitest-mock-extended';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { getQuartilesSeed } from './getQuartilesSeed';
import { Session } from 'next-auth';
import { ApiClientFactory } from './apiClient/apiClientFactory';

const indicatorsApiMock = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => indicatorsApiMock;

describe('getQuartilesSeed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should call published endpoint when session is not present', async () => {
    // arrange
    indicatorsApiMock.indicatorsQuartilesGet.mockResolvedValue([
      mockQuartileData(),
    ]);
    const session: Session | null = null;
    const quartilesParams = {};

    // act
    const result = await getQuartilesSeed(session, quartilesParams);

    // assert
    expect(result).toEqual([mockQuartileData()]);
    expect(indicatorsApiMock.indicatorsQuartilesGet).toHaveBeenCalled();
    expect(indicatorsApiMock.indicatorsQuartilesAllGet).not.toHaveBeenCalled();
  });

  it('should call unpublished endpoint when session is present', async () => {
    // arrange
    indicatorsApiMock.indicatorsQuartilesAllGet.mockResolvedValue([
      mockQuartileData(),
    ]);
    const session: Session | null = { expires: 'some name' };
    const quartilesParams = {};

    // act
    const result = await getQuartilesSeed(session, quartilesParams);

    // assert
    expect(result).toEqual([mockQuartileData()]);
    expect(indicatorsApiMock.indicatorsQuartilesAllGet).toHaveBeenCalled();
    expect(indicatorsApiMock.indicatorsQuartilesGet).not.toHaveBeenCalled();
  });
});
