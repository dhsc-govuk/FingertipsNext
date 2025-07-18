// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
//
import { render, screen } from '@testing-library/react';
import { SegmentationDropDowns } from '@/components/forms/SegmentationOptions/SegmentationDropDowns';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { SegmentationId } from '@/lib/common-types';

mockUsePathname.mockReturnValue('some-pathname');

const options = {
  [SegmentationId.Sex]: ['Persons', 'Male', 'Female'],
  [SegmentationId.Age]: ['All', 'Old', 'Young'],
  [SegmentationId.Frequency]: ['Annual', 'Quarterly'],
};

mockUseSearchStateParams.mockReturnValue({
  [SearchParams.SegmentationSex]: 'female',
  [SearchParams.SegmentationAge]: 'old',
  [SearchParams.SegmentationFrequency]: 'quarterly',
});

const title = 'Select segmentation options for the charts below';

const urlChangeSpy = vi
  .spyOn(window.history, 'pushState')
  .mockImplementation(() => {});

const testRender = (options: Record<SegmentationId, string[]>) => {
  render(<SegmentationDropDowns options={options} />);
  // design calls for one label across all 3 but each one has a hidden label,
  // hence the seeming repetition for the label text
  const selectSex = screen.getByRole<HTMLSelectElement>('combobox', {
    name: `${title} Options for segmentation by sex`,
  });
  const selectAge = screen.getByRole<HTMLSelectElement>('combobox', {
    name: `Options for segmentation by age`,
  });
  const selectFreq = screen.getByRole<HTMLSelectElement>('combobox', {
    name: `Options for segmentation by frequency`,
  });

  return {
    selectSex,
    selectAge,
    selectFreq,
  };
};

describe('SegmentationDropDowns', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSearchStateParams.mockReturnValue({
      [SearchParams.SegmentationSex]: 'female',
      [SearchParams.SegmentationAge]: 'old',
      [SearchParams.SegmentationFrequency]: 'quarterly',
    });
  });

  it('should default to the correct selections if no SearchParams exist', () => {
    mockUseSearchStateParams.mockReturnValue({});
    const { selectSex, selectAge, selectFreq } = testRender(options);
    expect(selectSex).toHaveValue('persons');
    expect(selectAge).toHaveValue('all');
    expect(selectFreq).toHaveValue('annual');
  });

  it('renders the three dropdowns', () => {
    const { selectSex, selectAge, selectFreq } = testRender(options);

    expect(selectSex).toBeInTheDocument();
    expect(selectAge).toBeInTheDocument();
    expect(selectFreq).toBeInTheDocument();

    const labelsSex = Array.from(selectSex.options).map((o) => o.textContent);
    const valuesSex = Array.from(selectSex.options).map((o) => o.value);
    expect(labelsSex).toEqual(['Persons', 'Male', 'Female']);
    expect(valuesSex).toEqual(['persons', 'male', 'female']);

    const labelsAge = Array.from(selectAge.options).map((o) => o.textContent);
    const valuesAge = Array.from(selectAge.options).map((o) => o.value);
    expect(labelsAge).toEqual(['All', 'Old', 'Young']);
    expect(valuesAge).toEqual(['all', 'old', 'young']);

    const labelsFreq = Array.from(selectFreq.options).map((o) => o.textContent);
    const valuesFreq = Array.from(selectFreq.options).map((o) => o.value);
    expect(labelsFreq).toEqual(['Annual', 'Quarterly']);
    expect(valuesFreq).toEqual(['annual', 'quarterly']);
  });

  it('should select the appropriate values from the search state', () => {
    const { selectSex, selectAge, selectFreq } = testRender(options);

    expect(selectSex).toHaveValue('female');
    expect(selectAge).toHaveValue('old');
    expect(selectFreq).toHaveValue('quarterly');
  });

  it('should call history push state when a change is made', async () => {
    const { selectSex, selectAge, selectFreq } = testRender(options);
    await userEvent.selectOptions(selectSex, 'male');
    expect(urlChangeSpy).toHaveBeenCalledWith(
      null,
      '',
      'some-pathname?segs=male&sega=old&segf=quarterly'
    );

    await userEvent.selectOptions(selectAge, 'all');
    expect(urlChangeSpy).toHaveBeenCalledWith(
      null,
      '',
      'some-pathname?segs=male&sega=all&segf=quarterly'
    );

    await userEvent.selectOptions(selectFreq, 'annual');
    expect(urlChangeSpy).toHaveBeenCalledWith(
      null,
      '',
      'some-pathname?segs=male&sega=all&segf=annual'
    );
  });

  it('should not call history push state when attempting to select the same thing', async () => {
    const { selectSex } = testRender(options);
    await userEvent.selectOptions(selectSex, 'female');

    expect(urlChangeSpy).not.toHaveBeenCalled();
  });

  it('should disable the inputs if there are no options available', () => {
    const { selectSex, selectAge, selectFreq } = testRender({
      [SegmentationId.Sex]: [],
      [SegmentationId.Age]: [],
      [SegmentationId.Frequency]: [],
    });

    expect(selectSex).toBeDisabled();
    expect(selectAge).toBeDisabled();
    expect(selectFreq).toBeDisabled();
  });
});
