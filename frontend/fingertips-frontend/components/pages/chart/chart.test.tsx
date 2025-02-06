import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams } from '@/lib/searchStateManager';
import { getMapFile } from '@/lib/mapUtils/getMapFile';
import { getMapJoinKey } from '@/lib/mapUtils/getMapJoinKey';
import { getMapGroup } from '@/lib/mapUtils/getMapGroup';
import { ThematicMap } from '@/components/organisms/ThematicMap';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
  };
});

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

describe('Page structure', () => {
  describe('Navigation', () => {
    it('should render back link with correct search parameters', () => {
      render(
        <Chart
          data={[mockHealthData[1]]}
          searchedIndicator="test"
          indicatorsSelected={['1', '2']}
        />
      );

      const backLink = screen.getByRole('link', { name: /back/i });
      const expectedUrl = `/results?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`;

      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
      expect(backLink).toHaveAttribute('href', expectedUrl);
    });
  });
});

describe('Content', () => {
  beforeEach(() => {
    render(<Chart data={[mockHealthData[1]]} />);
  });

  it('should render the title with correct text', () => {
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('View Dementia QOF prevalence');
  });

  it('should render the chart components', () => {
    const lineChart = screen.getByTestId('lineChart-component');
    const barChart = screen.getByTestId('barChart-component');
    const lineChartTable = screen.getByTestId('lineChartTable-component');

    expect(lineChart).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
    expect(lineChartTable).toBeInTheDocument();
  });
});

it('should render the PopulationPyramid component when Population data are provided', () => {
  render(
    <Chart
      data={[mockHealthData[1]]}
      populationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  const populationPyramid = screen.getByTestId('populationPyramid-component');
  expect(populationPyramid).toBeInTheDocument();
});

it('should render the scatterChart component when 2 indicators are selected', () => {
  render(<Chart data={[mockHealthData[1]]} indicatorsSelected={['0', '1']} />);
  const scatterChart = screen.getByTestId('scatterChart-component');

  expect(scatterChart).toBeInTheDocument();
});

it('should not render the scatterChart component when only 1 indicator is selected', () => {
  render(<Chart data={[mockHealthData[1]]} indicatorsSelected={['0']} />);
  const scatterChart = screen.queryByTestId('scatterChart-component');

  expect(scatterChart).not.toBeInTheDocument();
});

// TODO: apply correct business logic
it('should render the ThematicMap component when map props are passed', async () => {
  const areaType: string = 'Regions Statistical';
  const mapData = getMapFile(areaType);
  const mapJoinKey = getMapJoinKey(areaType);
  const mapGroup = getMapGroup(mapData, ['E08000025'], mapJoinKey);
  render(
    <ThematicMap
      data={mockHealthData['Mock 318 for West Midlands CA']}
      mapData={mapData}
      mapJoinKey={mapJoinKey}
      mapGroup={mapGroup}
    />
  );

  const thematicMap = await screen.findByTestId('thematicMap-component');
  expect(thematicMap).toBeInTheDocument();
});
