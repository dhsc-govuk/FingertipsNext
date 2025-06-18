import { generateXAxis } from './generateXAxis';
import { lineChartDefaultOptions } from './generateStandardLineChartOptions';
import { AXIS_TITLE_FONT_SIZE } from '@/lib/chartHelpers/chartHelpers';

describe('generateXAxis', () => {
  it('should return default xAxis options when no title or formatter is provided', () => {
    const xAxis = generateXAxis();

    expect(xAxis).toMatchObject({
      ...lineChartDefaultOptions.xAxis,
      title: {
        text: undefined,
        margin: 20,
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
    });
  });

  it('should return xAxis options with a custom title', () => {
    const title = 'Custom X Axis Title';
    const xAxis = generateXAxis(title);

    expect(xAxis.title).toEqual({
      text: title,
      margin: 20,
      style: { fontSize: AXIS_TITLE_FONT_SIZE },
    });
  });

  it('should use the provided labels formatter', () => {
    const mockFormatter = vi.fn();
    const xAxis = generateXAxis(undefined, mockFormatter);

    expect(xAxis.labels?.formatter).toBe(mockFormatter);
  });
});
