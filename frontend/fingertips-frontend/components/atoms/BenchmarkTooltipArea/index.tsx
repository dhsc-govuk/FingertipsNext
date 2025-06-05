import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledHoverWrapper,
  StyledYearParagraph,
  StyledDataWrapper,
  StyledSymbolDiv,
  StyledValueWrapper,
  StyledValueSpan,
} from './BenchmarkTooltipArea.Styles';

interface BenchmarkTooltipArea {
  titleText: string;
  year: number | undefined;
  valueText: string | undefined;
  symbol: SymbolsEnum;
  comparisonText?: string;
  symbolColour: GovukColours | undefined;
}

export function BenchmarkTooltipArea({
  titleText,
  year,
  valueText,
  comparisonText,
  symbol,
  symbolColour = GovukColours.Black,
}: Readonly<BenchmarkTooltipArea>) {
  return (
    <StyledHoverWrapper data-testid={'benchmark-tooltip-area'}>
      <div>
        <b>{titleText}</b>
        <StyledYearParagraph>{year}</StyledYearParagraph>
      </div>
      <StyledDataWrapper>
        <StyledSymbolDiv colour={symbolColour}>{symbol}</StyledSymbolDiv>
        <StyledValueWrapper>
          <StyledValueSpan>{valueText}</StyledValueSpan>
          {comparisonText}
        </StyledValueWrapper>
      </StyledDataWrapper>
    </StyledHoverWrapper>
  );
}
