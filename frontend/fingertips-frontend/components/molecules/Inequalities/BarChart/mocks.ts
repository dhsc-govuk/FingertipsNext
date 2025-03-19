import { InequalitiesBarChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';

export const getTestData = (): InequalitiesBarChartData => ({
  areaName: 'South FooBar',
  data: {
    period: 2008,
    inequalities: {
      Male: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
      },
      Persons: {
        value: 135.149304,
        count: 222,
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
});
