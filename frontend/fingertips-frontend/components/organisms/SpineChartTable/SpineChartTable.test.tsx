import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableHeadingEnum, SpineChartTableHeader } from '.';

describe('Spine chart table suite', () => {
  const mockHeaderData = {
    area: 'testArea',
    group: 'testGroup'}

  const EmptySpan = 3
  
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
  });
});
