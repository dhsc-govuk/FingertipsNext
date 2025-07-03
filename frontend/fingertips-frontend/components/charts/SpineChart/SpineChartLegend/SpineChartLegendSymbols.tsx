import { SpineChartLegendTypes } from '@/components/charts/SpineChart/SpineChartLegend/SpineChartLegend.types';

export const SpineChartLegendLine = () => (
  <svg width="1em" height="1em" viewBox="0 0 20 20">
    <line x1={10} y1={0} x2={10} y2={20} stroke={'#000'} strokeWidth={2} />
  </svg>
);

export const SpineChartLegendDiamond = () => (
  <svg width="1em" height="1em" viewBox="0 0 20 20">
    <rect
      x={4}
      y={4}
      width={12}
      height={12}
      stroke={'#000'}
      strokeWidth={2}
      fill={'none'}
      transform="rotate(45, 10, 10)"
    />
  </svg>
);

export const SpineChartLegendSquare = () => (
  <svg width="1em" height="1em" viewBox="0 0 20 20">
    <rect
      x={2}
      y={2}
      width={15}
      height={15}
      stroke={'#000'}
      strokeWidth={2}
      fill={'none'}
    />
  </svg>
);

export const SpineChartLegendCircle = () => (
  <svg width="1em" height="1em" viewBox="0 0 20 20">
    <circle
      cx={10}
      cy={10}
      r={8}
      stroke={'#000'}
      strokeWidth={2}
      fill={'none'}
    />
  </svg>
);

export const getLegendSymbol = (legendType: SpineChartLegendTypes) => {
  switch (legendType) {
    case SpineChartLegendTypes.Benchmark:
      return SpineChartLegendLine;
    case SpineChartLegendTypes.Group:
      return SpineChartLegendDiamond;
    case SpineChartLegendTypes.AreaTwo:
      return SpineChartLegendSquare;
    default:
      return SpineChartLegendCircle;
  }
};
