import {
  InequalitiesSexTableRowData,
  LineChartTableRowData,
  mapToInequalitiesSexTableData,
  mapToLineChartTableData,
} from '.';
import { MOCK_ENGLAND_DATA, MOCK_HEALTH_DATA } from './mocks';

describe('table helpers suite', () => {
  it('should map to inequalitiesSexTable row data', () => {
    const groupedYearData = {
      2008: [...MOCK_HEALTH_DATA[1].healthData],
    };

    const groupedEnglandData = {
      2004: [MOCK_ENGLAND_DATA.healthData[0]],
      2008: [MOCK_ENGLAND_DATA.healthData[1]],
    };

    const expectedInequalitiesSexTableRow: InequalitiesSexTableRowData[] = [
      {
        period: 2008,
        persons: 135.149304,
        male: 890.328253,
        female: 890.328253,
        englandBenchmark: 965.9843,
      },
    ];

    expect(
      mapToInequalitiesSexTableData(groupedYearData, groupedEnglandData)
    ).toEqual(expectedInequalitiesSexTableRow);
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
        period: 2004,
        value: 703.420759,
        count: 267,
        upper: 578.32766,
        lower: 441.69151,
      },
    ];

    expect(mapToLineChartTableData(MOCK_HEALTH_DATA[0])).toEqual(
      expectedRowData
    );
  });
});
