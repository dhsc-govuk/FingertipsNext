import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableHeadingEnum, SpineChartTableHeader, SpineChartTableRow } from '.';
import { GovukColours } from '@/lib/styleHelpers/colours';

describe('Spine chart table suite', () => {
  const mockHeaderData = {
    area: 'testArea',
    group: 'testGroup',}

  const mockRowData = {
    indicator: 'indicator',
    unit: '%',
    period: '2025',
    count: 123,
    value: 456,
    groupValue: 789,
    benchmarkValue: 987,
    benchmarkWorst: 345,
    benchmarkBest: 999,}
  
  describe('Spine chart table header', () => {

    it('should contain the expected elements', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('empty-header')).toHaveTextContent(
        ''
      );
      expect(screen.getByTestId('area-header')).toHaveTextContent(
        `${mockHeaderData.area}`
      );
      expect(screen.getByTestId('group-header')).toHaveTextContent(
        `${mockHeaderData.group}`
      );
      expect(screen.getByTestId('england-header')).toHaveTextContent(
        `Benchmark: England`
      );

      Object.values(SpineChartTableHeadingEnum).forEach((heading, index) =>
        expect(
          screen.getByTestId(`${heading}-header-${index}`)
        ).toBeInTheDocument()
      );
    });

    it('should have grey cell color for benchmark column', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('england-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );

      expect(screen.getByTestId('Value-header-6')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );      
      expect(screen.getByTestId('Worst-header-7')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('Best-header-8')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should have light grey cell color for the group column', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('group-header')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );

      expect(screen.getByTestId('Value-header-5')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });

    it('should have grey cell color for benchmark column', () => {
      render(
        <SpineChartTableRow
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={mockRowData.count}
          value={mockRowData.value}
          groupValue={mockRowData.groupValue}
          benchmarkValue={mockRowData.benchmarkValue}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('benchmark-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );      
      expect(screen.getByTestId('benchmark-worst-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('benchmark-best-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should have light grey cell color for benchmark column', () => {
      render(
        <SpineChartTableRow
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={mockRowData.count}
          value={mockRowData.value}
          groupValue={mockRowData.groupValue}
          benchmarkValue={mockRowData.benchmarkValue}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('group-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });

  });
});
