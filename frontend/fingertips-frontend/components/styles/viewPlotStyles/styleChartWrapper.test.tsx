import { render } from '@testing-library/react';
import { StyleChartWrapper } from './styleChartWrapper';

describe('styleChartWrapper', () => {
  it('should style the ChartWrapper component as expected', () => {
    const container = render(
      <StyleChartWrapper>
        <div data-testid="mock component"></div>
      </StyleChartWrapper>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
