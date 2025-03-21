import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox/index';
import { userEvent } from '@testing-library/user-event';

describe('ConfidenceIntervalCheckbox', () => {
  it('should check the checkbox when it is clicked', async () => {
    render(
      <ConfidenceIntervalCheckbox
        chartName="example chart"
        showConfidenceIntervalsData={false}
        setShowConfidenceIntervalsData={jest.fn()}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
