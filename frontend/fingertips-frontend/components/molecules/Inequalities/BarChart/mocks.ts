import { InequalitiesBarChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

export const tableData: InequalitiesBarChartData = {
  areaName: MOCK_HEALTH_DATA[1].areaName,
  data: {
    period: 2008,
    inequalities: {
      Persons: {
        value: 135.149304,
        count: 222,
        upper: 578.32766,
        lower: 441.69151,
      },
      Male: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
      },
      Female: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
      },
    },
  },
};
