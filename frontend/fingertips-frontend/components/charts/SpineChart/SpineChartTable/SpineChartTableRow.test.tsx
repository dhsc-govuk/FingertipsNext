import { render, screen } from '@testing-library/react';

import { SpineChartTableRow } from './SpineChartTableRow';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { SpineChartIndicatorData } from '../helpers/buildSpineChartIndicatorData';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { mockSpineIndicatorData } from '@/components/charts/SpineChart/SpineChartTable/spineChartMockTestData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const mockSearchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'some search',
};

vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

describe('Spine chart table row', () => {
  it('should have dark grey cell color for benchmark column', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorData={mockSpineIndicatorData}
            benchmarkToUse={areaCodeForEngland}
          />
        </tbody>
      </table>
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

  it('should have mid grey cell color for benchmark column', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorData={mockSpineIndicatorData}
            benchmarkToUse={areaCodeForEngland}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('group-value-cell')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('should have X for missing data and insufficient data', () => {
    const groupData: HealthDataForArea = {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [],
    };
    const indicatorWithMissingData: SpineChartIndicatorData = {
      ...mockSpineIndicatorData,
      groupData,
      areasHealthData: [
        {
          ...mockSpineIndicatorData.areasHealthData[0],
          areaCode: 'A1425',
          areaName: 'Greater Manchester ICB - 00T',
          healthData: [],
        },
      ],
      quartileData: {},
    };

    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorData={indicatorWithMissingData}
            benchmarkToUse={areaCodeForEngland}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('count-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('group-value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('benchmark-value-cell')).toHaveTextContent(`X`);

    expect(screen.getByText('Insufficient data available')).toBeInTheDocument();
  });

  it('should have an additional count and value section when an 2 areas are requested', () => {
    const indicatorDataWithTwoAreas = {
      ...mockSpineIndicatorData,
      areasHealthData: [
        mockSpineIndicatorData.areasHealthData[0],
        {
          areaCode: 'A1426',
          areaName: 'Greater Manchester ICB - 01T',
          healthData: [
            {
              year: 2025,
              count: 333,
              value: 800.305692,
              lowerCi: 341.69151,
              upperCi: 478.32766,
              ageBand: allAgesAge,
              sex: personsSex,
              trend: HealthDataPointTrendEnum.CannotBeCalculated,
              deprivation: noDeprivation,
            },
          ],
        },
      ],
    };
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorData={indicatorDataWithTwoAreas}
            twoAreasRequested
            benchmarkToUse={areaCodeForEngland}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('area-1-count-cell')).toHaveTextContent('222');
    expect(screen.getByTestId('area-1-value-cell')).toHaveTextContent('690.3');
    expect(screen.getByTestId('area-2-count-cell')).toHaveTextContent('333');
    expect(screen.getByTestId('area-2-value-cell')).toHaveTextContent('800.3');

    // Trend cell should not be displayed when 2 areas selected
    expect(screen.queryByTestId('trend-cell')).not.toBeInTheDocument();
  });

  it('should not render a cell for group if the group is England', () => {
    mockSearchState[SearchParams.GroupSelected] = areaCodeForEngland;

    const indicatorDataGroupEngland = {
      ...mockSpineIndicatorData,
      groupData: {
        areaCode: 'E92000001',
        areaName: 'England',
        healthData: [
          {
            year: 2025,
            count: 3333,
            value: 890.305692,
            lowerCi: 341.69151,
            upperCi: 478.32766,
            ageBand: allAgesAge,
            sex: personsSex,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    };

    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorData={indicatorDataGroupEngland}
            benchmarkToUse={areaCodeForEngland}
          />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId('group-value-cell')).not.toBeInTheDocument();
  });
});
