import { render, screen } from '@testing-library/react';

import { GovukColours } from '@/lib/styleHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import React from 'react';
import { BenchmarkWrapper, CellTypeEnum } from './BenchmarkingCellWrapper';

describe('BenchmarkingCellWrapper', () => {
  const renderWithTableComponent = (component: React.ReactNode) => {
    return render(
      <table>
        <tbody>
          <tr>{component}</tr>
        </tbody>
      </table>
    );
  };

  it('renders children correctly', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType={CellTypeEnum.Cell}
      >
        <span>Test</span>
      </BenchmarkWrapper>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders group cell colour MidGrey when benchmark is not England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse="not-england"
        label="group"
        cellType={CellTypeEnum.Cell}
      >
        Group Cell
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-cell')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
  });

  it('renders group cell colour LightGrey when benchmark is England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType={CellTypeEnum.Cell}
      >
        Group Cell
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-cell')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('renders group header colour LightGrey when benchmark is not England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse="not-england"
        label="group"
        cellType={CellTypeEnum.Header}
      >
        Group Header
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-header')).toHaveStyle(
      `background: ${GovukColours.LightGrey}`
    );
  });

  it('renders group header colour LightGrey when benchmark is England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType={CellTypeEnum.Header}
      >
        Group Header
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-header')).toHaveStyle(
      `background: ${GovukColours.LightGrey}`
    );
  });

  it('renders group subheader colour MidGrey when benchmark is not England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse="not-england"
        label="group"
        cellType={CellTypeEnum.SubHeader}
      >
        Group SubHeader
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-subheader')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
  });

  it('renders group subheader colour LightGrey when benchmark is England', () => {
    renderWithTableComponent(
      <BenchmarkWrapper
        benchmarkToUse={areaCodeForEngland}
        label="group"
        cellType={CellTypeEnum.SubHeader}
      >
        Group SubHeader
      </BenchmarkWrapper>
    );
    expect(screen.getByTestId('group-subheader')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });
});
