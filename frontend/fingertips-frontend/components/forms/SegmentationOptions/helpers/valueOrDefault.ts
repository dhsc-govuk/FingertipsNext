import { SelectOption } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';

export const valueOrDefault = (
  options: SelectOption[],
  selectedValue?: string
): string => {
  if (!options.length) return '';
  return selectedValue && options.some(({ value }) => value === selectedValue)
    ? selectedValue
    : options[0].value;
};
