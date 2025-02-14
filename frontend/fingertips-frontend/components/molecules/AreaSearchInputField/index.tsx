import styled from 'styled-components';
import { InputField } from 'govuk-react';
import { ValueType } from '@opentelemetry/api';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleAreaSearchBoxPanel = styled('div')({
  marginBottom: '5px',
  whiteSpace: '6',
});

export const StyleSearchHeader = styled('h3')({
  padding: '0px',
  fontSize: '19px',
});

interface SearchInputFieldProps {
  onTextChange?: (criteria: string) => void;
  disabled?: boolean;
  touched?: boolean;
}

export const AreaSearchInputField = ({
  onTextChange,
  touched,
  disabled,
}: SearchInputFieldProps) => {
  return (
    <StyleAreaSearchBoxPanel>
      <InputField
        input={{
          id: 'areaSearched',
          name: 'areaSearched',
          onChange: (e) => {
            const val = e.target.value;
            if (onTextChange != null) {
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
          error: 'This field value may be required',
        }}
        data-testid="search-form-input-area"
      >
        Search for an area
      </InputField>
    </StyleAreaSearchBoxPanel>
  );
};
