import { render, screen } from '@testing-library/react';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea/index';

describe('BenchmarkTooltipArea', () => {
  describe('areas', () => {
    it('should render the expected tooltip for an area', () => {
      render(
        <BenchmarkTooltipArea
          titleText="Test Area"
          periodLabel={1976}
          valueText={'some string'}
          comparisonText={'test text'}
          symbol={SymbolsEnum.Circle}
          symbolColour={GovukColours.Red}
        />
      );
      expect(screen.getByText('Test Area')).toBeInTheDocument();
      expect(screen.getByText('1976')).toBeInTheDocument();
      expect(screen.getByText('some string')).toBeInTheDocument();
      expect(screen.getByText('test text')).toBeInTheDocument();
      expect(screen.getByText(SymbolsEnum.Circle)).toBeInTheDocument();
      expect(screen.getByText(SymbolsEnum.Circle)).toHaveStyle({
        color: GovukColours.Red,
      });
    });
  });
});
