// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { InequalitiesBarChartTable } from './InequalitiesBarChartTable';
import { render, screen } from '@testing-library/react';

import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { getTestData } from '../InequalitiesBarChart/mocks';
import { InequalitiesBarChartTableHeaders } from '@/components/charts/Inequalities/InequalitiesBarChartTable/InequalitiesBarChartTableHead';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

mockHighChartsWrapperSetup();
describe('Inequalities bar chart table suite', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('Sex inequality', () => {
    it('should render the inequalitiesBarChartTable component', () => {
      render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
        />
      );

      expect(
        screen.getByTestId('inequalitiesBarChartTable-component')
      ).toBeInTheDocument();
    });

    it('should render expected elements', () => {
      const expectedGroupings = ['Persons', 'Male', 'Female'];

      render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
        />
      );

      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent(
        'inequalities for South FooBar, 2008'
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      Object.values(InequalitiesBarChartTableHeaders).forEach((header) => {
        expect(screen.getByTestId(`heading-${header}`)).toBeInTheDocument();
      });
      expectedGroupings.forEach((grouping) => {
        expect(screen.getByText(grouping)).toBeInTheDocument();
      });
      expect(screen.getByRole('button')).toHaveTextContent('Export options');
    });

    it('should display x if data point is not available', () => {
      const expectedNumberOfRows = 3;
      const expectedNumberOfCols = Object.values(
        InequalitiesBarChartTableHeaders
      ).length;
      const mockData = getTestData();
      mockData.data.inequalities.Persons = { value: 1 };
      mockData.data.inequalities.Male = { value: 1 };
      mockData.data.inequalities.Female = { value: 1 };
      render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={mockData}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
        />
      );
      expect(screen.getAllByRole('cell')).toHaveLength(
        expectedNumberOfRows * expectedNumberOfCols
      );

      const notAvailable = screen.getAllByTestId('not-available');
      expect(notAvailable).toHaveLength(9);
      notAvailable.forEach((id) => expect(id).toHaveTextContent('X'));
    });

    it('check if the measurementUnit value "kg" is rendered correctly with braces', () => {
      render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
          indicatorMetadata={{ unitLabel: 'kg' } as IndicatorDocument}
        />
      );
      expect(screen.getByText('kg')).toBeInTheDocument();
    });

    it('check if that measurementUnit value is not shown when its not passed', () => {
      render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
        />
      );
      expect(
        screen.queryByTestId('inequalitiesBarChart-measurementUnit')
      ).not.toBeInTheDocument();
    });

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <InequalitiesBarChartTable
          title="inequalities for South FooBar, 2008"
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          inequalityTypeSelected="Sex"
          indicatorMetadata={{ unitLabel: 'kg' } as IndicatorDocument}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
        />
      );

      expect(container.asFragment()).toMatchSnapshot();
    });

    describe('Benchmarked', () => {
      it('should render with benchmarks', () => {
        const mockData = getTestData();
        mockData.data.inequalities.Persons = {
          ...mockData.data.inequalities.Persons,
          benchmarkComparison: {
            outcome: BenchmarkOutcome.Better,
          },
        };
        mockData.data.inequalities.Male = {
          ...mockData.data.inequalities.Male,
          benchmarkComparison: {
            outcome: BenchmarkOutcome.Worse,
          },
        };
        mockData.data.inequalities.Female = {
          ...mockData.data.inequalities.Female,
          benchmarkComparison: {
            outcome: BenchmarkOutcome.Similar,
          },
        };
        render(
          <InequalitiesBarChartTable
            title="inequalities for South FooBar, 2008"
            tableData={mockData}
            type={InequalitiesTypes.Sex}
            inequalityTypeSelected="Sex"
          />
        );

        expect(screen.queryByText('Better')).toBeNull();
        expect(screen.getByText('Worse')).toBeInTheDocument();
        expect(screen.getByText('Similar')).toBeInTheDocument();
      });

      it('should render 99.8% confidence', () => {
        render(
          <InequalitiesBarChartTable
            title="inequalities for South FooBar, 2008"
            tableData={getTestData()}
            type={InequalitiesTypes.Sex}
            inequalityTypeSelected="Sex"
            benchmarkComparisonMethod={
              BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
            }
          />
        );
        expect(
          screen.getByText(/99.8\s*%\s*confidence\s*limits/i)
        ).toBeInTheDocument();
      });

      it('should not render confidence limits if missing', () => {
        render(
          <InequalitiesBarChartTable
            title="inequalities for South FooBar, 2008"
            tableData={getTestData()}
            type={InequalitiesTypes.Sex}
            inequalityTypeSelected="Sex"
            benchmarkComparisonMethod={BenchmarkComparisonMethod.Unknown}
          />
        );
        expect(screen.queryByText('confidence limits')).not.toBeInTheDocument();
      });
    });
  });
});
