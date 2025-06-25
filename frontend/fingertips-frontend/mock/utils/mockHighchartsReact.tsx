import { HighchartsReact } from 'highcharts-react-official';

vi.mock('highcharts-react-official', () => ({
  HighchartsReact: vi.fn(() => <div data-testid="mock-highcharts" />),
}));

export const mockHighcharts = HighchartsReact as unknown as ReturnType<
  typeof vi.fn
>;
