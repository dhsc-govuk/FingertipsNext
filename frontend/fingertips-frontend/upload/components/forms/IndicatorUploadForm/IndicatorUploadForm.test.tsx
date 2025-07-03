import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IndicatorUploadForm } from '.';

const addIndicatorIdLabelText = /Add indicator ID/;
const publishDateDayLabelText = /Day/;
const publishDateMonthLabelText = /Month/;
const publishDateYearLabelText = /Year/;
const uploadFileLabelText = /Upload a file/;

describe('IndicatorUploadForm', () => {
  it('should include an indicator ID field', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={false} />);

    expect(screen.getByLabelText(addIndicatorIdLabelText)).toBeInTheDocument();
    expect(
      screen.getByText('This is a unique identification number')
    ).toBeInTheDocument();
  });

  it('should include a publication date field', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={false} />);

    expect(screen.getByText('Add a publish date')).toBeInTheDocument();
    expect(
      screen.getByText('The date must be today or in the future')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(publishDateDayLabelText)).toBeInTheDocument();
    expect(
      screen.getByLabelText(publishDateMonthLabelText)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(publishDateYearLabelText)).toBeInTheDocument();
  });

  it('should include a file upload field', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={false} />);

    expect(screen.getByLabelText(uploadFileLabelText)).toBeInTheDocument();
    expect(
      screen.getByText(
        'The file must be the CSV format provided by this service'
      )
    ).toBeInTheDocument();
  });

  it('should include a submit button', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={false} />);

    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(
      screen.getByText('Submit the uploaded file and information')
    ).toBeInTheDocument();
  });

  it('the submit button should not be disabled when an upload is not pending', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={false} />);

    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('the submit button should be disabled when an upload is pending', () => {
    render(<IndicatorUploadForm action={vi.fn()} uploadPending={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('clicking the submit button should trigger the action function with the form details', async () => {
    const user = userEvent.setup();
    const formAction = vi.fn();

    const expectedIndicatorId = '1234';
    // const expectedFile = 'file';
    const expectedPublishDateDay = '7';
    const expectedPublishDateMonth = '3';
    const expectedPublishDateYear = '2020';

    render(<IndicatorUploadForm action={formAction} uploadPending={false} />);

    await user.type(
      screen.getByLabelText(addIndicatorIdLabelText),
      expectedIndicatorId
    );
    await user.type(
      screen.getByLabelText(publishDateDayLabelText),
      expectedPublishDateDay
    );
    await user.type(
      screen.getByLabelText(publishDateMonthLabelText),
      expectedPublishDateMonth
    );
    await user.type(
      screen.getByLabelText(publishDateYearLabelText),
      expectedPublishDateYear
    );
    // TODO: Upload file
    await user.click(screen.getByRole('button'));

    expect(formAction).toHaveBeenCalled();
    const actionParameters = formAction.mock.lastCall;
    const actualFormData = actionParameters?.[0] as FormData;
    expect(actualFormData.get('indicatorId')).toBe(expectedIndicatorId);
    // TODO: Validate file properly
    // expect(actualFormData.get('file')).toBe(expectedFile);
    expect(actualFormData.get('publishDateDay')).toBe(expectedPublishDateDay);
    expect(actualFormData.get('publishDateMonth')).toBe(
      expectedPublishDateMonth
    );
    expect(actualFormData.get('publishDateYear')).toBe(expectedPublishDateYear);
  });
});
