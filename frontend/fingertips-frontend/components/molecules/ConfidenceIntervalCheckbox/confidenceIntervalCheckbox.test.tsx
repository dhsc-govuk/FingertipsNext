import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox/index';
import { userEvent } from '@testing-library/user-event';

describe('ConfidenceIntervalCheckbox', () => {
  it('should check the checkbox when it is clicked', async () => {
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        confidenceIntervalSelected={false}
        handleSetConfidenceIntervalSelected={jest.fn()}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should show the confidenceIntervalSelected state when checkbox is checked', async () => {
    const confidenceIntervalSelected = false;
    const setConfidenceIntervalSelected = jest.fn();
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        confidenceIntervalSelected={confidenceIntervalSelected}
        handleSetConfidenceIntervalSelected={setConfidenceIntervalSelected}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();

    expect(setConfidenceIntervalSelected).toHaveBeenCalledWith(true);
  });

  it('should hide the confidenceIntervalSelected state when checkbox is un-checked', async () => {
    const confidenceIntervalSelected = true;
    const setConfidenceIntervalSelected = jest.fn();

    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        confidenceIntervalSelected={confidenceIntervalSelected}
        handleSetConfidenceIntervalSelected={setConfidenceIntervalSelected}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    expect(setConfidenceIntervalSelected).toHaveBeenCalledWith(false);
  });
});
