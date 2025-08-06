import Highcharts, { DashStyleValue } from 'highcharts';
import { chartSymbols } from '@/components/organisms/LineChart/helpers/generateSeriesData';
import {
  generateConfidenceIntervalSeries,
  isEnglandSoleSelectedArea,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  InequalitiesTableRowData,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { chartColours, UniqueChartColours } from '@/lib/chartHelpers/colours';

const mapToChartColorsForInequality: Record<InequalitiesTypes, string[]> = {
  [InequalitiesTypes.Sex]: [
    GovukColours.Orange,
    UniqueChartColours.OtherLightBlue,
    GovukColours.Purple,
  ],
  [InequalitiesTypes.Deprivation]: chartColours,
};

const dashStyle = (index: number): DashStyleValue => {
  if (index < 3) return 'Solid';
  if (index < 8) return 'ShortDash';
  return 'Dash';
};

export const generateInequalitiesLineChartSeriesData = (
  keys: string[],
  type: InequalitiesTypes,
  rows: InequalitiesTableRowData[],
  areasSelected: string[],
  showConfidenceIntervalsData?: boolean,
  inequalitiesAreaSelected?: string
): Highcharts.SeriesOptionsType[] => {
  const colorList = mapToChartColorsForInequality[type];
  if (!rows.length) {
    throw new Error('no data for any year');
  }

  return keys.flatMap((key, index) => {
    const lineSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: key,
      data: rows.map((periodData) => [
        periodData.period,
        periodData.inequalities[key]?.value,
      ]),
      marker: {
        symbol: chartSymbols[index % chartSymbols.length],
      },
      color: colorList[index % colorList.length],
      dashStyle: dashStyle(index),
    };

    // We have different display requirements for the aggregate
    // data when England is the selected area
    if (
      index === 0 &&
      (isEnglandSoleSelectedArea(areasSelected) ||
        inequalitiesAreaSelected === areaCodeForEngland)
    ) {
      lineSeries.color = GovukColours.Black;
      lineSeries.marker = { symbol: 'circle' };
    }

    const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
      generateConfidenceIntervalSeries(
        key,
        rows.map((data) => [
          data.period,
          data.inequalities[key]?.lower,
          data.inequalities[key]?.upper,
        ]),
        showConfidenceIntervalsData
      );

    return showConfidenceIntervalsData
      ? [lineSeries, confidenceIntervalSeries]
      : [lineSeries];
  });
};
