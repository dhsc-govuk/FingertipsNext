import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';

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
  // TODO: refactor to use styled components

  return (
    <div
      data-testid={'benchmark-tooltip-area'} // TODO: change this name?
      style={{ marginBlock: '10px', textWrap: 'wrap' }}
    >
      <div>
        <b>{titleText}</b>
        <p style={{ marginBlock: 0 }}>{year}</p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em',
        }}
      >
        <div
          style={{
            color: symbolColour,
            display: 'flex',
            marginLeft: '5px',
            gap: '0.5em',
            fontSize: '24px',
          }}
        >
          {symbol}
        </div>

        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'block' }}>{valueText}</span>
          {comparisonText}
        </div>
      </div>
    </div>
  );
}
