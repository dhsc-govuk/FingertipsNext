import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

function benchmarkComparisonMethodToString(
  benchmarkComparisonMethod: BenchmarkComparisonMethod
): string {
  switch (benchmarkComparisonMethod) {
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue95:
      return '(95%)';
    case BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8:
      return '(99.8%)';
    case BenchmarkComparisonMethod.Quintiles:
      return 'Highest quintile';
    default:
      return 'Not compared';
  }
}

function formatUnits(units: string): string {
  if (units !== '%') {
    return ' ' + units;
  }

  return units;
}

interface FormatBarHoverProps {
  period: number;
  lowerName: string;
  lowerValue: number;
  upperName: string;
  upperValue: number;
  units: string;
  colour: string;
  indicatorName: string;
}

interface FormatSymbolHoverProps {
  title: string;
  period: number;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  value: number;
  units: string;
  outcome?: string;
  colour: string;
  shape: SymbolsEnum;
  indicatorName: string;
}

function formatSymbol(colour: string, shape: SymbolsEnum) {
  return `<span style="color:${colour}; font-size:19px;">${shape}</span>`;
}

function formatTitleBlock(
  title: string,
  period: number,
  indicatorName: string
) {
  return `<div style="width: 250px; font-size: 16px; text-wrap: wrap;">
        <h4 style="margin:0px; padding:0px;">
          ${title}
        </h4>
        <span style="display: block;">${period}</span>
        <span>${indicatorName}</span>`;
}

export function formatBarHover(props: FormatBarHoverProps) {
  return `${formatTitleBlock('Benchmark: England', props.period, props.indicatorName)}
            <div style="padding:0px; margin:0px;">
                <div style="display:flex; 
                  flex-direction:row;
                  align-items: center;
                  flex-wrap:nowrap;
                  justify-content: flex-start;
                  ">
                  <span style="color:${props.colour}; font-size:19px;">${SymbolsEnum.Square}</span> 
                  <div style="flex-grow:2; padding:0.5em;">
                    <span style="display: block;">${formatNumber(props.lowerValue)}${formatUnits(props.units)} to ${formatNumber(props.upperValue)}${formatUnits(props.units)}</span>
                    <span style="display: block;">${props.lowerName} to ${props.upperName}</span>
                  </div>
              </div>
            <div>
          <div>`;
}

export function formatSymbolHover(props: FormatSymbolHoverProps) {
  let outcomeContent = '';

  if (props.outcome) {
    if (props.outcome === 'Not compared') {
      outcomeContent = '<span style="display: block;">Not compared</span>';
    } else {
      outcomeContent = `<span style="display: block;">${props.outcome} than England</span>
                        <span style="display: block;">${benchmarkComparisonMethodToString(props.benchmarkComparisonMethod)}</span>`;
    }
  }

  return `${formatTitleBlock(props.title, props.period, props.indicatorName)}
            <div style="padding:0px; margin:0px;">
                <div style="display:flex; 
                  flex-direction:row;
                  align-items: center;
                  flex-wrap:nowrap;
                  justify-content: flex-start;
                  ">
                  ${formatSymbol(props.colour, props.shape)} 
                  <div style="flex-grow:2; 
                    padding:0.5em;
                    ">
                    <span style="display: block;">${formatNumber(props.value)}${formatUnits(props.units)}</span>
                    ${outcomeContent}
                  </div>
              </div>
            <div>
          <div>`;
}
