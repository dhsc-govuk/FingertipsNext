import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkLabel } from '@/lib/chartHelpers/chartHelpers';
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
      return '';
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
  benchmarkName: string;
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
  benchmarkName: string;
}

function formatSymbol(colour: string, shape: SymbolsEnum) {
  const shadowStyle = `text-shadow:
                        0 0 1.5px #000,
                        0 0 1.5px #000,
                        0 0 1.5px #000,
                        0 0 1.5px #000;`;

  return `<div style="color:${colour}; font-size:30px;
            ${shape !== SymbolsEnum.PlotLine ? shadowStyle : ''} 
          ">
            ${shape}
          </div>`;
}

function hoverTemplate(
  titleContent: string,
  symbolContent: string,
  mainContent: string
) {
  return `<div style="width: 250px; font-size: 16px; text-wrap: wrap;"> 
            ${titleContent}
            <div style="padding:0px; margin:0px;">
              <div style="display:flex; 
                flex-direction:row;
                align-items: center;
                flex-wrap:nowrap;
                justify-content: flex-start;">
                ${symbolContent} 
                <div style="flex-grow:2; padding:0.5em;"> 
                  ${mainContent}
                </div>
              </div>
            </div>
          </div>`;
}

function formatTitleBlock(
  title: string,
  period: number,
  indicatorName: string
) {
  return `<div>
            <h4 style="margin:0px; padding:0px;">${title}</h4>
            <div>${period}</div>
            <div>${indicatorName}</div>
          </div>`;
}

export function formatBarHover(props: FormatBarHoverProps) {
  const mainContent = `<div>
                        ${formatNumber(props.lowerValue)}${formatUnits(props.units)} to ${formatNumber(props.upperValue)}${formatUnits(props.units)}
                      </div>
                      <div>${props.lowerName} to ${props.upperName}</div>`;

  return hoverTemplate(
    formatTitleBlock(
      `Benchmark: ${props.benchmarkName}`,
      props.period,
      props.indicatorName
    ),
    formatSymbol(props.colour, SymbolsEnum.Square),
    mainContent
  );
}

export function formatSymbolHover(props: FormatSymbolHoverProps) {
  const mainContent = `<div>${formatNumber(props.value)}${formatUnits(props.units)}</div>
                      ${getBenchmarkLabel(props.benchmarkComparisonMethod, props.outcome as BenchmarkOutcome, props.benchmarkName)}
                      <div>${benchmarkComparisonMethodToString(props.benchmarkComparisonMethod)}</div>`;

  return hoverTemplate(
    formatTitleBlock(props.title, props.period, props.indicatorName),
    formatSymbol(props.colour, props.shape),
    mainContent
  );
}
