import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  SpineChartTableHeadingEnum,
  SpineChartTableHeader,
} from './SpineChartTableHeader';
import { GovukColours } from '@/lib/styleHelpers/colours';

describe('Spine chart table header', () => {
  const mockHeaderData = {
    area: 'testArea',
    group: 'testGroup',
  };

  it('should contain the expected elements', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaName={mockHeaderData.area}
            groupName={mockHeaderData.group}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('empty-header')).toHaveTextContent('');
    expect(screen.getByTestId('area-header')).toHaveTextContent(
      `${mockHeaderData.area}`
    );
    expect(screen.getByTestId('group-header')).toHaveTextContent(
      `${mockHeaderData.group}`
    );
    expect(screen.getByTestId('england-header')).toHaveTextContent(
      `Benchmark: England`
    );

    Object.values(SpineChartTableHeadingEnum).forEach((heading) =>
      expect(screen.getByTestId(`${heading}-header`)).toBeInTheDocument()
    );
  });

  it('should have grey cell color for benchmark column', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaName={mockHeaderData.area}
            groupName={mockHeaderData.group}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('england-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );

    expect(screen.getByTestId('Value-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
    expect(screen.getByTestId('Worst-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
    expect(screen.getByTestId('Best-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
  });

  it('should have light grey cell color for the group column', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaName={mockHeaderData.area}
            groupName={mockHeaderData.group}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('group-header')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );

    expect(screen.getByTestId('GroupValue-header')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });
});
