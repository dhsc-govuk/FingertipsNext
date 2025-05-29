import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { BenchmarkingCellWrapper } from './BenchmarkingCellWrapper';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

describe('BenchmarkingCellWrapper', () => {
  it('renders group cell colour MidGrey when benchmark is not England', () => {
    render(
      <BenchmarkingCellWrapper
        benchmarkToUse="not-england"
        label="group"
        cellType="group"
      >
        Group Cell
      </BenchmarkingCellWrapper>
    );
    expect(screen.getByTestId('group-cell')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
  });

  it('renders group cell colour LightGrey when benchmark is England', () => {
    render(
      <BenchmarkingCellWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType="group"
      >
        Group Cell
      </BenchmarkingCellWrapper>
    );
    expect(screen.getByTestId('group-cell')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('renders children correctly', () => {
    render(
      <BenchmarkingCellWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType="group"
      >
        <span>Test</span>
      </BenchmarkingCellWrapper>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
