import { render } from '@testing-library/react';
import { LegendLabel } from '@/components/organisms/BenchmarkLegend/LegendLabel';

test('load and display benchmark legend component', async () => {
  render(<LegendLabel />);
});
