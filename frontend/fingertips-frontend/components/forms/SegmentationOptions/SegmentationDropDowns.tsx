import { SegmentationDropDown } from '@/components/forms/SegmentationOptions/SegmentationDropDown';
import {
  InlineDropDownsContainer,
  StyledLabel,
} from '@/components/forms/SegmentationOptions/SegmentationDropDowns.styles';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { valueOrDefault } from '@/components/forms/SegmentationOptions/helpers/valueOrDefault';
import { usePathname } from 'next/navigation';
import { SegmentationId } from '@/lib/common-types';

interface SegmentationDropDownsProps {
  options: Record<SegmentationId, string[]>;
}

const toOption = (label: string) => ({ label, value: label.toLowerCase() });

export function SegmentationDropDowns({
  options,
}: Readonly<SegmentationDropDownsProps>) {
  const pathname = usePathname();
  const searchState = useSearchStateParams();
  const {
    [SearchParams.SegmentationSex]: selectedSegSex,
    [SearchParams.SegmentationAge]: selectedSegAge,
    [SearchParams.SegmentationFrequency]: selectedSegFreq,
  } = searchState;

  const searchStateManager = SearchStateManager.initialise(searchState);

  const onChange = (segmentId: SearchParams) => (newValue: string) => {
    const currentValue = searchState[segmentId];
    if (newValue === currentValue) return;

    searchStateManager.addParamValueToState(segmentId, newValue);

    const newUrl = searchStateManager.generatePath(pathname);
    window.history.pushState(null, '', newUrl);
  };

  const sexOptions = options[SegmentationId.Sex].map(toOption);
  const ageOptions = options[SegmentationId.Age].map(toOption);
  const freqOptions = options[SegmentationId.Frequency].map(toOption);

  const sexValue = valueOrDefault(sexOptions, selectedSegSex);
  const ageValue = valueOrDefault(ageOptions, selectedSegAge);
  const freqValue = valueOrDefault(freqOptions, selectedSegFreq);

  return (
    <div data-testid="segmentation-options">
      <StyledLabel htmlFor={`seg-segs`}>
        Select segmentation options for the charts below
      </StyledLabel>
      <InlineDropDownsContainer>
        <SegmentationDropDown
          label={'Options for segmentation by sex'}
          segmentId={SearchParams.SegmentationSex}
          options={sexOptions}
          onChange={onChange(SearchParams.SegmentationSex)}
          value={sexValue}
        />
        <SegmentationDropDown
          label={'Options for segmentation by age'}
          segmentId={SearchParams.SegmentationAge}
          options={ageOptions}
          onChange={onChange(SearchParams.SegmentationAge)}
          value={ageValue}
        />
        <SegmentationDropDown
          label={'Options for segmentation by frequency'}
          segmentId={SearchParams.SegmentationFrequency}
          options={freqOptions}
          onChange={onChange(SearchParams.SegmentationFrequency)}
          value={freqValue}
        />
      </InlineDropDownsContainer>
    </div>
  );
}
