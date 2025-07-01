import { InequalitiesBarChartData } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export const getTestData = (): InequalitiesBarChartData => ({
  areaCode: 'A1425',
  areaName: 'South FooBar',
  data: {
    period: 2008,
    inequalities: {
      Male: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
        isAggregate: false,
      },
      Persons: {
        value: 135.149304,
        count: 222,
        upper: 578.32766,
        lower: 441.69151,
        isAggregate: true,
      },
      Female: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
        isAggregate: false,
      },
    },
  },
});
