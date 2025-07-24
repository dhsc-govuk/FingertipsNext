// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { render, screen } from '@testing-library/react';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { HeatMapWrapper } from '@/components/charts/HeatMap/HeatMapWrapper';
import { ChartTitleKeysEnum } from '@/lib/ChartTitles/chartTitleEnums';

describe('HeatMapWrapper', () => {
  beforeEach(() => {
    mockUseSearchStateParams.mockReturnValue({});
  });

  it('renders null when indicatorMetaData is empty array', () => {
    const { container } = render(
      <HeatMapWrapper
        indicatorMetaData={[]}
        healthData={[mockIndicatorWithHealthDataForArea()]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders null when healthData is empty array', () => {
    const { container } = render(
      <HeatMapWrapper
        indicatorMetaData={[mockIndicatorDocument()]}
        healthData={[]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders HeatMap', () => {
    render(
      <HeatMapWrapper
        indicatorMetaData={[mockIndicatorDocument()]}
        healthData={[mockIndicatorWithHealthDataForArea()]}
      />
    );

    expect(
      screen.getByTestId(`${ChartTitleKeysEnum.Heatmap}-component`)
    ).toBeInTheDocument();
  });
});
