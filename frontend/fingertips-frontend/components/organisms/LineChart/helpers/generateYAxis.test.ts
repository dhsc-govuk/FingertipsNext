import { generateYAxis } from './generateYAxis';
import { lineChartDefaultOptions } from './generateStandardLineChartOptions';
import { AXIS_TITLE_FONT_SIZE } from '@/lib/chartHelpers/chartHelpers';

describe('generateYAxis', () => {
  it('should return default yAxis options when no title is provided', () => {
    const yAxis = generateYAxis();

    expect(yAxis).toMatchObject({
      ...lineChartDefaultOptions.yAxis,
      title: undefined,
    });
  });

  it('should return yAxis options with a custom title', () => {
    const title = 'Custom Y Axis Title';
    const yAxis = generateYAxis(title);

    expect(yAxis.title).toEqual({
      text: title,
      margin: 20,
      style: { fontSize: AXIS_TITLE_FONT_SIZE },
    });
  });

  it('should have a labels formatter function', () => {
    const yAxis = generateYAxis();

    expect(typeof yAxis.labels?.formatter).toBe('function');
  });
});
