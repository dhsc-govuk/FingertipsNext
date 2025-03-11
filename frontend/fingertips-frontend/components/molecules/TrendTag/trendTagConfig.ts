import { Trend, TrendCondition } from '@/lib/common-types';
import { TagColours } from '@/lib/styleHelpers/colours';

export const getTrendColour = (trend: Trend) => {
  switch (trend) {
    case Trend.NO_SIGNIFICANT_CHANGE:
      return {
        backgroundColor: TagColours.YellowBackground,
        color: TagColours.YellowText,
      };
    case Trend.DECREASING:
      return {
        backgroundColor: TagColours.LightBlueBackground,
      };
    case Trend.INCREASING:
      return {
        backgroundColor: TagColours.LightBlue,
      };
    default:
      return null;
  }
};

export const getTrendConditionColours = (trendCondition?: TrendCondition) => {
  switch (trendCondition) {
    case TrendCondition.GETTING_BETTER:
      return {
        backgroundColor: TagColours.GreenBackground,
        color: TagColours.GreenText,
      };
    case TrendCondition.GETTING_WORSE:
      return {
        backgroundColor: TagColours.RedBackground,
        color: TagColours.RedText,
      };
    default:
      return null;
  }
};
