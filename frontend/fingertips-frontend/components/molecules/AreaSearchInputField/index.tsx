import styled from 'styled-components';
import { InputField } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleAreaSearchInputField = styled('div')({
  marginBottom: '5px',
});


interface AreaSearchInputFieldProps {
  onTextChange?: (criteria: string) => void;
  disabled?: boolean;
  touched?: boolean;
  value: string | undefined;
}

export const AreaSearchInputField = ({
  onTextChange,
  touched,
  disabled,
  value,
}: AreaSearchInputFieldProps) => {
  return (
    <StyleAreaSearchInputField>
      <InputField
        input={{
          id: 'areaSearched',
          name: 'areaSearched',
          defaultValue: value,
          value: value,
          onChange: (e) => {
            const val = e.target.value;
            if (onTextChange) {
              onTextChange(val);
            }
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
          touched: touched,
          error: touched ? 'This field value may be required' : '',
        }}
        data-testid="search-form-input-area"
      >
        Search for an area
      </InputField>
    </StyleAreaSearchInputField>
  );
};
