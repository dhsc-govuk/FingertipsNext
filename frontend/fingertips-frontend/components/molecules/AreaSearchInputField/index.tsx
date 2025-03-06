import styled from 'styled-components';
import { InputField } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleAreaSearchInputField = styled('div')({
  marginBottom: '5px',
});

interface AreaSearchInputFieldProps {
  onTextChange: (criteria: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  value: string | undefined;
}

export const AreaSearchInputField = ({
  onTextChange,
  hasError,
  disabled,
  value,
}: AreaSearchInputFieldProps) => {
  return (
    <StyleAreaSearchInputField data-testid="area-search-input-field">
      <InputField
        input={{
          value: value ?? '',
          onChange: (e) => {
            onTextChange(e.target.value);
          },
          disabled: disabled,
        }}
        hint={
          <div style={{ color: GovukColours.DarkGrey }}>
            For example district, county, region, NHS organisation or GP
            practice or code
          </div>
        }
        meta={{
          touched: hasError,
          error: hasError ? 'Enter an area you want to search for' : '',
        }}
      >
        Search for an area
      </InputField>
    </StyleAreaSearchInputField>
  );
};
