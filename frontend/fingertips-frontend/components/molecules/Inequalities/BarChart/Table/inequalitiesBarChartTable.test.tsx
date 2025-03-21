import { InequalitiesBarChartTable } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { getTestData } from '../mocks';
import { InequalitiesBarChartTableHeaders } from '@/components/molecules/Inequalities/BarChart/Table/InequalitiesBarChartTableHead';
import {
  HealthDataPointBenchmarkComparisonMethodEnum,
  HealthDataPointBenchmarkComparisonOutcomeEnum,
} from '@/generated-sources/ft-api-client';

describe('Inequalities bar chart table suite', () => {
  describe('Sex inequality', () => {
    it('should render the inequalitiesBarChartTable component', () => {
      render(
        <InequalitiesBarChartTable
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
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
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      Object.values(InequalitiesBarChartTableHeaders).forEach((header) => {
        expect(screen.getByTestId(`heading-${header}`)).toBeInTheDocument();
      });
      expectedGroupings.forEach((grouping) => {
        expect(screen.getByText(grouping)).toBeInTheDocument();
      });
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
          tableData={mockData}
          type={InequalitiesTypes.Sex}
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
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          measurementUnit="kg"
        />
      );
      expect(screen.getByText('kg')).toBeInTheDocument();
    });

    it('check if that measurementUnit value is not shown when its not passed', () => {
      render(
        <InequalitiesBarChartTable
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
        />
      );
      expect(
        screen.queryByTestId('inequalitiesBarChart-measurementUnit')
      ).not.toBeInTheDocument();
    });

    it('snapshot test - should match snapshot', () => {
      const container = render(
        <InequalitiesBarChartTable
          tableData={getTestData()}
          type={InequalitiesTypes.Sex}
          measurementUnit="kg"
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
            outcome: HealthDataPointBenchmarkComparisonOutcomeEnum.Better,
            method: HealthDataPointBenchmarkComparisonMethodEnum.Rag,
          },
        };
        mockData.data.inequalities.Male = {
          ...mockData.data.inequalities.Male,
          benchmarkComparison: {
            outcome: HealthDataPointBenchmarkComparisonOutcomeEnum.Worse,
            method: HealthDataPointBenchmarkComparisonMethodEnum.Rag,
          },
        };
        mockData.data.inequalities.Female = {
          ...mockData.data.inequalities.Female,
          benchmarkComparison: {
            outcome: HealthDataPointBenchmarkComparisonOutcomeEnum.Similar,
            method: HealthDataPointBenchmarkComparisonMethodEnum.Rag,
          },
        };
        render(
          <InequalitiesBarChartTable
            tableData={mockData}
            type={InequalitiesTypes.Sex}
          />
        );

        expect(screen.queryByText('Better')).toBeNull();
        expect(screen.getByText('Worse')).toBeInTheDocument();
        expect(screen.getByText('Similar')).toBeInTheDocument();
      });
    });
  });
});
