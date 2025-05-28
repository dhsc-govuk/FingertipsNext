import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableHeader } from './SpineChartTableHeader';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';

describe('Spine chart table header', () => {
  const mockHeaderData = {
    area: 'testArea',
    group: 'testGroup',
  };

  const mockSearchState = { [SearchParams.GroupSelected]: 'A001' };

  it('should contain the expected elements', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaNames={[mockHeaderData.area]}
            groupName={mockHeaderData.group}
            benchmarkToUse={areaCodeForEngland}
            searchState={mockSearchState}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('empty-header')).toHaveTextContent('');
    expect(screen.getByTestId('area-header-1')).toHaveTextContent(
      `${mockHeaderData.area}`
    );
    expect(screen.getByTestId('group-header')).toHaveTextContent(
      `${mockHeaderData.group}`
    );
    expect(screen.getByTestId('england-header')).toHaveTextContent(
      `Benchmark: England`
    );
    expect(screen.getByTestId('area-trend-header')).toHaveTextContent(
      'Recent trend'
    );
    expect(screen.getByTestId('area-count-header')).toHaveTextContent('Count');
    expect(screen.getByTestId('area-value-header')).toHaveTextContent('Value');
  });

  it('should have grey cell color for benchmark column', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaNames={[mockHeaderData.area]}
            groupName={mockHeaderData.group}
            benchmarkToUse={areaCodeForEngland}
            searchState={mockSearchState}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('england-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );

    expect(screen.getByTestId('group-value-header')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
    expect(screen.getByTestId('benchmark-worst-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
    expect(screen.getByTestId('benchmark-best-header')).toHaveStyle(
      `background-color: ${GovukColours.MidGrey}`
    );
  });

  it('should have light grey cell color for the group column', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaNames={[mockHeaderData.area]}
            groupName={mockHeaderData.group}
            benchmarkToUse={areaCodeForEngland}
            searchState={mockSearchState}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('group-header')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );

    expect(screen.getByTestId('group-value-header')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('it should render counts and values for 2 areas when requested', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaNames={['East of England Region', 'East Midlands Region']}
            groupName={mockHeaderData.group}
            benchmarkToUse={areaCodeForEngland}
            searchState={mockSearchState}
          />
        </thead>
      </table>
    );

    expect(screen.getByTestId('area-header-1')).toHaveTextContent(
      'East of England Region'
    );
    expect(screen.getByTestId('area-header-2')).toHaveTextContent(
      'East Midlands Region'
    );
    expect(screen.getByTestId('area-1-count-header')).toHaveTextContent(
      'Count'
    );
    expect(screen.getByTestId('area-1-value-header')).toHaveTextContent(
      'Value'
    );
    expect(screen.getByTestId('area-2-count-header')).toHaveTextContent(
      'Count'
    );
    expect(screen.getByTestId('area-2-value-header')).toHaveTextContent(
      'Value'
    );
    expect(screen.queryByTestId('area-trend-header')).not.toBeInTheDocument();
  });

  it('should not render the group header value if group is England', () => {
    render(
      <table>
        <thead>
          <SpineChartTableHeader
            areaNames={['East of England Region']}
            groupName={'England'}
            benchmarkToUse={areaCodeForEngland}
            searchState={{
              [SearchParams.GroupSelected]: areaCodeForEngland,
            }}
          />
        </thead>
      </table>
    );

    expect(screen.queryByTestId('group-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('group-value-header')).not.toBeInTheDocument();
  });
});
