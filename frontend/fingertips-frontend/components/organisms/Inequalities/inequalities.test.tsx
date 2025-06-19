import { act, render, screen, waitFor } from '@testing-library/react';
import { Inequalities } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { LoaderContext } from '@/context/LoaderContext';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: vi.fn(),
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

describe('Inequalities suite', () => {
  it('should render inequalities component', async () => {
    await act(async () => {
      render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA} />);
    });

    await waitFor(async () => {
      expect(screen.getByTestId('inequalities-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('inequalitiesLineChartTable-component')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('inequalitiesLineChart-component')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('inequalitiesBarChartTable-component')
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('inequalitiesBarChart-component')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
      ).toBeInTheDocument();
    });
  });

  it('should render expected text', async () => {
    await act(async () => {
      render(<Inequalities healthIndicatorData={MOCK_HEALTH_DATA} />);
    });

    expect(
      await screen.findByText(/Inequalities data for a single time period/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Inequalities data over time/i)
    ).toBeInTheDocument();
  });

  it('check if the measurement unit value "kg" is rendered correctly', async () => {
    await act(async () => {
      render(
        <Inequalities
          healthIndicatorData={MOCK_HEALTH_DATA}
          indicatorMetadata={{ unitLabel: 'kg' } as IndicatorDocument}
        />
      );
    });

    expect(await screen.findByText('kg')).toBeInTheDocument();
  });
});
