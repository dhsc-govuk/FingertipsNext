import { getHoverAreaName } from '@/components/organisms/Heatmap/generateHeatmapRows';
import { mockArea } from '@/mock/data/mockArea';

describe('get hover area name', () => {
  it('should prefix the area name with "Benchmark: " if the benchmark area code matches the area code', () => {
    const got = getHoverAreaName(
      mockArea(),
      'some group area code',
      mockArea().code
    );

    expect(got).toBe(`Benchmark: ${mockArea().name}`);
  });

  it('should prefix the area name with "Group: " if the group area code matches the area code', () => {
    const got = getHoverAreaName(
      mockArea(),
      mockArea().code,
      'some benchmark area code'
    );

    expect(got).toBe(`Group: ${mockArea().name}`);
  });

  it('should not prefix the area name with anything if neither the benchmark area code or the group area code match the area code', () => {
    const got = getHoverAreaName(
      mockArea(),
      'some group area code',
      'some benchmark area code'
    );

    expect(got).toBe(`${mockArea().name}`);
  });
});
