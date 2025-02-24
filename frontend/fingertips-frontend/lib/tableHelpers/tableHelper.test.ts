import {
  InequalitiesSexTableRowData,
  mapToInequalitiesTableData,
} from '@/components/molecules/Inequalities/Table';
import { MOCK_HEALTH_DATA } from './mocks';
import {
  LineChartTableRowData,
  mapToLineChartTableData,
} from '@/components/organisms/LineChartTable';
import {
  convertToPercentage,
  getDisplayedValue,
  getNonAvailablePlaceHolder,
} from '.';

describe('table helpers suite', () => {
  it('should map to inequalitiesSexTable row data', () => {
    const groupedYearData = {
      2004: {
        Male: [MOCK_HEALTH_DATA[0].healthData[1]],
        Female: [MOCK_HEALTH_DATA[0].healthData[2]],
      },
      2008: {
        All: [MOCK_HEALTH_DATA[1].healthData[0]],
        Male: [MOCK_HEALTH_DATA[1].healthData[1]],
        Female: [MOCK_HEALTH_DATA[1].healthData[2]],
      },
    };

    const expectedInequalitiesSexTableRow: InequalitiesSexTableRowData[] = [
      {
        period: 2004,
        Male: 703.420759,
        Female: 703.420759,
      },
      {
        period: 2008,
        All: 135.149304,
        Male: 890.328253,
        Female: 890.328253,
      },
    ];

    expect(mapToInequalitiesTableData(groupedYearData)).toEqual(
      expectedInequalitiesSexTableRow
    );
  });

  it('should map to linechart table row data', () => {
    const expectedRowData: LineChartTableRowData[] = [
      {
        period: 2008,
        value: 890.305692,
        count: 222,
        upper: 578.32766,
        lower: 441.69151,
      },
      {
        count: 267,
        lower: 441.69151,
        period: 2004,
        upper: 578.32766,
        value: 703.420759,
      },
    ];

    expect(mapToLineChartTableData(MOCK_HEALTH_DATA[0])).toEqual(
      expectedRowData
    );
  });

  describe('convertToPercentage', () => {
    it('should convert to percentage', () => {
      expect(convertToPercentage(379.65616)).toBe(`3.8%`);
    });

    it('should fail to convert to percentage', () => {
      const value = undefined;
      expect(convertToPercentage(value)).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });

  describe('getNonAvailablePlaceHolder', () => {
    it('should return expected not available X', () => {
      expect(getNonAvailablePlaceHolder()).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });

  describe('getDisplayedValue', () => {
    it('should display value when available', () => {
      const value = 5;
      expect(getDisplayedValue(value)).toBe(value);
    });

    it('should return X when value not available', () => {
      const value = undefined;
      expect(getDisplayedValue(value)).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });
});
