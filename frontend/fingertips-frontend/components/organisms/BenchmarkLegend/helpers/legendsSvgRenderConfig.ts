import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { legendsRenderConfig } from '@/components/organisms/BenchmarkLegend/helpers/legendsRenderConfig';

export const legendsSvgRenderConfig = (
  legendsToShow: BenchmarkLegendsToShow
) => {
  const renderConfig = legendsRenderConfig(legendsToShow);
  const {
    show95,
    show99,
    showQnoJudgement,
    hideDuplicateQuintileSubheading,
    showQ,
  } = renderConfig;

  let cumulativeY = 35;
  const yValues = { y95: 0, y99: 0, yQnoJudgement: 0, yQJudgement: 0 };
  const ySpacing = 60;
  const ySpacingWithoutSubheading = 50;
  if (show95) {
    yValues.y95 = cumulativeY;
    cumulativeY += ySpacing;
  }
  if (show99) {
    yValues.y99 = cumulativeY;
    cumulativeY += ySpacing;
  }

  if (showQnoJudgement) {
    yValues.yQnoJudgement = cumulativeY;
    cumulativeY += hideDuplicateQuintileSubheading
      ? ySpacingWithoutSubheading
      : ySpacing;
  }

  if (showQ) {
    yValues.yQJudgement = cumulativeY;
    cumulativeY += ySpacing - 20;
  }

  return { ...renderConfig, cumulativeY, yValues };
};
