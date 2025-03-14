import { InequalitiesChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

export const tableData: InequalitiesChartData = {
  areaName: MOCK_HEALTH_DATA[1].areaName,
  rowData: [
    {
      period: 2004,
      inequalities: {
        Persons: { value: 890.3432 },
        Male: { value: 703.420759 },
        Female: { value: 703.420759 },
      },
    },
    {
      period: 2008,
      inequalities: {
        Persons: { value: 135.149304 },
        Male: { value: 890.328253 },
        Female: { value: 890.328253 },
      },
    },
  ],
};
