import { render, screen } from '@testing-library/react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox/index';
import { userEvent } from '@testing-library/user-event';

describe('ConfidenceIntervalCheckbox', () => {
  it('should check the checkbox when it is clicked', async () => {
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
        setShowConfidenceIntervalsData={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should show the confidenceIntervalSelected state when checkbox is checked', async () => {
    const setShowConfidenceIntervalsDataMock = vi.fn();
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsDataMock}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();

    expect(setShowConfidenceIntervalsDataMock).toHaveBeenCalledWith(true);
  });

  it('should hide the confidenceIntervalSelected state when checkbox is un-checked', async () => {
    const setShowConfidenceIntervalsDataMock = vi.fn();

    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={true}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsDataMock}
      />
    );

    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    expect(setShowConfidenceIntervalsDataMock).toHaveBeenCalledWith(false);
  });
});
