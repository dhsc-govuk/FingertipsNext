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
    case Trend.NOT_AVAILABLE:
      return {
        backgroundColor: TagColours.GreyBackground,
        color: TagColours.GreyText,
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

export const getArrowColour = (
  trend: Trend,
  trendCondition?: TrendCondition
): TagColours | undefined => {
  if (trend === Trend.NO_SIGNIFICANT_CHANGE) {
    return TagColours.YellowText;
  }

  return getTrendConditionColours(trendCondition)?.color;
};
