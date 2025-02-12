import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox/index';
import { SearchParams } from '@/lib/searchStateManager';
import { userEvent } from '@testing-library/user-event';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => ({
      [SearchParams.ConfidenceIntervalSelected]: 'example chart',
    }),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

describe('ConfidenceIntervalCheckbox', () => {
  it('should check the checkbox when it is clicked', async () => {
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should show confidence interval bars when checkbox is clicked', async () => {
    const { container, rerender } = render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();

    rerender(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={true}
      />
    );
    const confidenceIntervalBars = container.getElementsByClassName(
      'highcharts-errorbar-series'
    );

    expect(confidenceIntervalBars).toBeTruthy();
  });

  it('should not show confidence interval bars when checkbox is not clicked', async () => {
    const { container } = render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
      />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    const confidenceIntervalBars = container.getElementsByClassName(
      'highcharts-errorbar-series'
    );

    expect(confidenceIntervalBars).toHaveLength(0);
  });

  it('should update the url with the chart name when the checkbox is clicked', async () => {
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.ConfidenceIntervalSelected}=example+chart`,
      {
        scroll: false,
      }
    );
  });
});
