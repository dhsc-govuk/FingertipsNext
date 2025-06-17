import { queryKeyFromRequestParams } from '@/components/charts/helpers/queryKeyFromRequestParams';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';

describe('queryKeyFromRequestParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('serializes single key-value pairs', () => {
    const result =
      queryKeyFromRequestParams<GetHealthDataForAnIndicatorRequest>({
        indicatorId: 123,
        areaType: 'England',
      });
    expect(result).toBe('areaType=England&indicatorId=123');
  });

  it('sorts keys using localeSort', () => {
    const result = queryKeyFromRequestParams({ b: '2', a: '1' });
    expect(result).toBe('a=1&b=2');
  });

  it('handles array values and sorts them', () => {
    const result =
      queryKeyFromRequestParams<GetHealthDataForAnIndicatorRequest>({
        indicatorId: 0,
        areaCodes: ['beta', 'alpha'],
      });
    expect(result).toBe('areaCodes=alpha&areaCodes=beta&indicatorId=0');
  });

  it('skips undefined values', () => {
    const result = queryKeyFromRequestParams({
      one: '1',
      two: undefined,
      three: '3',
    });
    expect(result).toBe('one=1&three=3');
  });

  it('handles mixed scalar and array values correctly', () => {
    const result =
      queryKeyFromRequestParams<GetHealthDataForAnIndicatorRequest>({
        indicatorId: 789,
        areaType: 'England',
        areaCodes: ['beta', 'alpha', 'charlie'],
      });
    expect(result).toBe(
      'areaCodes=alpha&areaCodes=beta&areaCodes=charlie&areaType=England&indicatorId=789'
    );
  });

  it('handles empty input gracefully', () => {
    const result = queryKeyFromRequestParams({});
    expect(result).toBe('');
  });
});
