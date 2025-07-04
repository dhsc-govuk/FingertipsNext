import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { ChangeEvent } from 'react';
import { SelectOption } from '@/components/forms/SegmentationOptions/segmentationDropDown.types';

interface SegmentationDropDownProps {
  label: string;
  segmentId: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  value?: string;
}

export function SegmentationDropDown({
  label,
  segmentId,
  options,
  value,
  onChange,
}: Readonly<SegmentationDropDownProps>) {
  const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const hasOptions = options.length > 0;

  return (
    <StyledFilterSelect
      label={label}
      data-testid={`seg-${segmentId}`}
      aria-label={label}
      input={{
        id: `seg-${segmentId}`,
        value,
        onChange: handleOnChange,
        disabled: !hasOptions,
      }}
    >
      {!hasOptions ? <option>No options available</option> : null}
      {options.map((option) => (
        <option key={`seg-${segmentId}-${option.value}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledFilterSelect>
  );
}
